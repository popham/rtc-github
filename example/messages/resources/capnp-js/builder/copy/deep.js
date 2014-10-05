define([ "../../reader/layout/any", "../../reader/list/meta", "../../reader/isNull", "../layout/structure", "../layout/list" ], function(any, meta, isNull, structure, layout) {
    /*
     * Copy a structure to a blob of memory.
     *
     * arena Arena - The source structure's arena.
     * layout StructureLayout - Stripped reader data describing the structure to
     * be copied.
     * targetArena BuilderArena - The arena where the copied structure will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the
     * structure.
     */
    var setStructure = function(arena, layout, targetArena, blob) {
        var source = {
            segment: layout.segment,
            position: layout.dataSection
        };
        var target = {
            segment: blob.segment,
            position: blob.position
        };
        // Copy the data section verbatim.
        var dataLength = layout.pointersSection - layout.dataSection;
        targetArena._write(source, dataLength, target);
        // Deep copy the pointers section.
        source.position += dataLength;
        target.position += dataLength;
        for (;source.position < layout.end; source.position += 8, target.position += 8) {
            copy(arena, source, targetArena, target);
        }
    };
    /*
     * Copy a structure to a blob of memory and direct a pointer to it.
     *
     * arena Arena - The source structure's arena.
     * layout StructureLayout - Stripped reader data describing the structure to
     * be copied.
     * targetArena BuilderArena - The arena where the copied structure will be
     * written.
     * target Datum - The location within `targetArena` to write a pointer that
     * dereferences to the copied structure.
     */
    var setStructurePointer = function(arena, layout, targetArena, target) {
        var blob = targetArena._preallocate(target.segment, layout.end - layout.dataSection);
        setStructure(arena, layout, targetArena, blob);
        structure.preallocated(target, blob, {
            meta: 0,
            dataBytes: layout.pointersSection - layout.dataSection,
            pointersBytes: layout.end - layout.pointersSection
        });
    };
    /*
     * Deep copy a list's pointers.  The list's non-pointers remain untouched.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be
     * copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     * For inline composite lists, this should reference the position
     * immediately following the list's tag.
     */
    var setListPointerSections = function(arena, layout, targetArena, blob) {
        var source = {
            segment: layout.segment,
            position: layout.begin
        };
        var target = {
            segment: blob.segment,
            position: blob.position
        };
        for (var i = 0; i < layout.length; ++i) {
            var end = source.position + layout.pointersBytes;
            // Skip the data section.
            source.position += layout.dataBytes;
            target.position += layout.dataBytes;
            // Copy the pointer section.
            for (;source.position < end; source.position += 8, target.position += 8) {
                copy(arena, source, targetArena, target);
            }
        }
    };
    /*
     * Copy the full list regardless of whether a particular item is a primitive
     * or a pointer.  Any copied pointers will still reference with respect to
     * `layout.segment` within `arena`.
     *
     * arena Arena - The source list's arena.
     * meta ListMeta - Metadata describing the pointer to be copied.
     * layout ListLayout - Reader data describing the list to be copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     * size UInt32 - The size of each list element in bytes.
     */
    var setListVerbatim = function(arena, meta, layout, targetArena, blob) {
        var bytes;
        var source = {
            segment: layout.segment,
            position: layout.begin
        };
        if (meta.layout === 1) {
            bytes = layout.length >>> 3;
            var remainder = layout.length & 7;
            if (remainder) {
                // Clobber any junk on the tail of the source in preparation for
                // copying.
                source.segment[source.position + bytes] &= 255 >>> 8 - remainder;
                bytes += 1;
            }
        } else {
            bytes = layout.length * (layout.dataBytes + layout.pointersBytes);
        }
        targetArena._write(source, bytes, blob);
    };
    /*
     * Copy a list to a blob of memory.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be
     * copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     */
    var setList = function(arena, layout, targetArena, blob) {
        var data;
        var m = meta(layout);
        if (m.layout === 7) {
            // Copy the tag word.
            targetArena._write({
                segment: layout.segment,
                position: layout.begin - 8
            }, 8, blob);
            data = {
                segment: blob.segment,
                position: blob.position + 8
            };
        } else {
            data = blob;
        }
        if (layout.dataBytes !== 0) {
            setListVerbatim(arena, m, layout, targetArena, data);
        }
        if (layout.pointersBytes !== 0) {
            /*
             * Overwrite verbatim pointer copies with deep copies.  Since the
             * copying must succeed before linking into an internal data
             * structure, the data structure will not be corrupted upon failure.
             * If the data structure isn't copied subsequent to such a failure,
             * however, the garbage can leak to external clients.
             */
            setListPointerSections(arena, layout, targetArena, data);
        }
    };
    /*
     * Copy a list to a blob of memory and direct a pointer to it.
     *
     * arena Arena - The source list's arena.
     * ell ListLayout - Stripped reader data describing the list to be copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * target Datum - The location within `targetArena` to write a pointer that
     * dereferences to the copied list.
     */
    var setListPointer = function(arena, ell, targetArena, target) {
        var m = meta(ell);
        var blob;
        if (m.layout === 1) {
            blob = targetArena._preallocate(target.segment, (ell.length >>> 3) + (ell.length & 7 ? 1 : 0));
        } else if (m.layout === 7) {
            // Add an extra 8 bytes for the tag word.
            blob = targetArena._preallocate(target.segment, 8 + ell.length * (ell.dataBytes + ell.pointersBytes));
        } else {
            blob = targetArena._preallocate(target.segment, ell.length * (ell.dataBytes + ell.pointersBytes));
        }
        setList(arena, ell, targetArena, blob);
        layout.preallocated(target, blob, m, ell.length);
    };
    /*
     * Deep copy the `source` datum's pointer to the `target` datum.
     *
     * * arena ReaderArena - Arena that contains the source data.
     * * source Datum - Position of a pointer within `arena`.
     * * targetArena BuilderArena - Arena that the data will be copied into.
     * * target Datum - Position of the pointer within arena that should
     * * dereference to the data's copy.
     *
     * * RETURNS: Datum - Root of the branch that was copied.
     */
    var copy = function(arena, source, targetArena, target) {
        if (!isNull(source)) {
            var layout = any.safe(arena, source);
            switch (layout.meta) {
              case 0:
                setStructurePointer(arena, layout, targetArena, target);
                break;

              case 1:
                setListPointer(arena, layout, targetArena, target);
                break;
            }
        }
        return target;
    };
    return {
        setStructurePointer: setStructurePointer,
        setListPointer: setListPointer,
        setAnyPointer: copy,
        setStructure: setStructure,
        setList: setList
    };
});