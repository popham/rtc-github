define([ "../reader/layout/index", "../reader/isNull", "../reader/far", "../reader/list/meta", "./primitives", "./far", "./layout/index", "./shiftOffset" ], function(reader, isNull, farReader, meta, encode, farBuilder, builder, shiftOffset) {
    /*
     * Update a far pointer with its list or structure pointer if it shares a
     * segment with its blob.
     *
     * * arena BuilderArena - Arena that owns `pointer`.
     * * pointer Datum - New pointer location, filled with the initial pointer's
     *   data.  If the blob remains nonlocal, then no-op.
     */
    var far = function(arena, pointer) {
        /*
         * A double far pointer implies that the there was no space on the
         * blob's segment at construction time.  Without any means to reclaim
         * memory from a segment, this should remain true.
         */
        if (pointer.segment[pointer.position] & 4) return;
        var blob = farReader.blob(arena, pointer);
        if (pointer.segment === blob.segment) {
            // The blob is now local
            var tag = farReader.tag(arena, pointer);
            var offset = blob.position - (pointer.position + 8);
            // Copy tag as pointer (then clobber the offset)
            arena._write(tag, 8, pointer);
            encode.int32(offset >> 1 | tag.segment[tag.position] & 3, pointer.segment, pointer.position);
            // Zero the single far landing pad.
            arena._zero(tag, 8);
        }
    };
    /*
     * Shift the offsets of a sequence of list or structure pointers.  Far
     * pointers and capabilities are left unaltered.
     *
     * * iTarget Datum - Position of the first pointer in the sequence.
     * * length UInt32 - Number of pointers in the sequence.
     * * delta Int33 - The shift to apply to each pointer's offset.
     */
    var intrasegmentMovePointers = function(iTarget, length, delta) {
        for (var i = 0; i < length; ++i, iTarget.position += 8) {
            if (!isNull(iTarget)) {
                var typeBits = iTarget.segment[iTarget.position] & 3;
                if (typeBits === 0 || typeBits === 1) {
                    shiftOffset(iTarget, delta);
                }
            }
        }
    };
    /*
     * Move a sequence of list or structure pointers to another segment.  
     * * Local pointers become far pointer landing pads, so zero old far
     *   pointers and capabilities.
     * * Far pointers that remain on a non-local segment are left unaltered, but
     *   new locals get installed as such, zeroing any far pointer remnants.
     *
     * * arena Arena - The parent arena that the pointers will get moved within.
     * * iSource Datum - Position of the first pointer in the sequence.
     * * length UInt32 - Number of pointers in the sequence.
     * * iTarget Datum - Position where the moved pointers should be written.
     */
    var intersegmentMovePointers = function(arena, iSource, length, iTarget) {
        for (var i = 0; i < length; ++i, iSource.position += 8, iTarget.position += 8) {
            if (!isNull(iTarget)) {
                var typeBits = iSource.segment[iSource.position] & 3;
                switch (typeBits) {
                  case 0:
                  case 1:
                    // Was local, so use the old pointer as a landing pad.
                    farBuilder.terminal(iTarget, iSource);
                    break;

                  case 2:
                    /*
                     * Update the target pointer for possible locality with its
                     * blob, and discard the old far pointer.
                     */
                    far(arena, iTarget);
                }
            }
        }
    };
    /*
     * Upgrade an older-versioned structure to contain sufficient space for its
     * compiled version.
     *
     * * arena BuilderArena - The parent arena of the structure that will be
     *   upgraded.
     * * pointer Datum - Position of the pointer whose structure will be
     *   upgraded.
     * * ct StructureMeta - Compile-time metadata of the upgrade-targeted
     *   structure.
     */
    var structure = function(arena, pointer, ct) {
        var blob = arena._preallocate(pointer.segment, ct.dataBytes + ct.pointersBytes);
        var layout = reader.structure.unsafe(arena, pointer);
        var rtData = layout.pointersSection - layout.dataSection;
        var rtPointers = layout.end - layout.pointersSection;
        // Verbatim copy of the data section.
        arena._write({
            segment: layout.segment,
            position: layout.dataSection
        }, rtData, blob);
        // Set up pointers section source and target iterators.
        var iSource = {
            segment: layout.segment,
            position: layout.pointersSection
        };
        var iTarget = {
            segment: blob.segment,
            position: blob.position + ct.dataBytes
        };
        // Make a verbatim copy of the pointers section.
        arena._write(iSource, rtPointers, iTarget);
        if (layout.segment === blob.segment) {
            // Moving within the same segment
            intrasegmentMovePointers(iTarget, rtPointers >>> 3, layout.pointersSection - iTarget.position);
            // Clobber the old structure entirely.
            arena._zero({
                segment: layout.segment,
                position: layout.dataSection
            }, rtPointers);
        } else {
            // Moving to another segment.
            intersegmentMovePointers(arena, iSource, rtPointers >>> 3, iTarget);
            // Clobber the old structure's data section.
            arena._zero({
                segment: layout.segment,
                position: layout.dataSection
            }, layout.pointersSection - layout.dataSection);
        }
        builder.structure.preallocated(pointer, blob, ct);
    };
    /*
     * Upgrade a list's elements to contain sufficient space for its compiled
     * version.
     *
     * arena BuilderArena - The parent arena of the list that will be upgraded.
     * pointer Datum - Position of the pointer whose list will be upgraded.
     * ct ListMeta - Compile-time metadata of the upgrade-targeted list.
     */
    var list = function(arena, pointer, ct) {
        var layout = reader.list.unsafe(arena, pointer);
        var rt = meta(layout);
        var blob, begin;
        var bytes = ct.dataBytes + ct.pointersBytes;
        if (ct.layout === 7) {
            blob = arena._preallocate(pointer.segment, 8 + layout.length * bytes);
            builder.list.preallocated(pointer, blob, ct, layout.length);
            blob.position += 8;
        } else {
            blob = arena._preallocate(pointer.segment, layout.length * bytes);
            builder.list.preallocated(pointer, blob, ct, layout.length);
        }
        var slop = {
            data: ct.dataBytes - rt.dataBytes,
            pointers: ct.pointersBytes - rt.pointersBytes
        };
        /*
         * Shift of the list's first pointer section (only useful for local
         * allocations).
         * `blob.position+ct.dataBytes - (layout.begin+rt.dataBytes)`.
         */
        var delta = blob.position + slop.data - layout.begin;
        // Misalignment between compile-time structures and run-time structures.
        var mis = slop.pointers + slop.data;
        var iSource = {
            segment: layout.segment,
            position: layout.begin
        };
        var iTarget = blob;
        for (var i = 0; i < layout.length; ++i) {
            // Verbatim copy the data section.
            arena._write(iSource, rt.dataBytes, iTarget);
            iSource.position += rt.dataBytes;
            iTarget.position += rt.dataBytes;
            iTarget.position += slop.data;
            if (rt.layout >= 6) {
                // Make a verbatim copy of the pointers section.
                arena._write(iSource, rt.pointersBytes, iTarget);
                if (layout.segment === blob.segment) {
                    intrasegmentMovePointers(iTarget, rt.pointersBytes >>> 3, -(delta + i * mis));
                    iSource.position += rt.pointersBytes;
                } else {
                    intersegmentMovePointers(arena, iSource, rt.pointersBytes >>> 3, iTarget);
                }
            }
            // Realign the target iterator.
            iTarget.position += slop.pointers;
        }
    };
    return {
        list: list,
        structure: structure
    };
});