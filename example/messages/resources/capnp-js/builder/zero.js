define([ "../reader/layout/any", "../reader/isNull" ], function(any, isNull) {
    /*
     * Zero a structure's memory, recurring into its pointers.
     *
     * * arena BuilderArena - The structure's parent arena.
     * * layout StructureLayout - Layout of the structure to be zeroed.
     */
    var structure = function(arena, layout) {
        var blob = {
            segment: layout.segment,
            position: layout.dataSection
        };
        var iPointer = {
            segment: layout.segment,
            position: layout.pointersSection
        };
        for (;iPointer.position < layout.end; iPointer.position += 8) {
            zero(arena, iPointer);
        }
        arena._zero(blob, layout.end - layout.dataSection);
    };
    /*
     * Zero a list's memory, recurring into its pointers.
     *
     * * arena BuilderArena - The list's parent arena.
     * * layout ListLayout - Layout of the list to be zeroed.
     */
    var list = function(arena, layout) {
        var bytes = layout.length * (layout.dataBytes + layout.pointersBytes);
        var blob = {
            segment: layout.segment,
            position: layout.begin
        };
        var iPointer = {
            segment: layout.segment,
            position: layout.begin + layout.dataBytes
        };
        // Adjust for the list's tag word.
        if (layout.size === 7) {
            bytes += 8;
            blob.position -= 8;
        }
        if (layout.pointersBytes !== 0) {
            // Iterate the pointer sections to zero the corresponding blobs.
            for (var i = 0; i < layout.length; ++i, iPointer.position += layout.dataBytes) {
                var end = iPointer.position + layout.pointersBytes;
                for (;iPointer.position < end; iPointer.position += 8) {
                    zero(arena, iPointer);
                }
            }
        }
        arena._zero(blob, bytes);
    };
    /*
     * Zero a far pointer's landing pad.  No-op if the provided pointer is not a
     * far pointer.
     * * arena BuilderArena - The pointer's parent arena.
     * * pointer Datum - The far pointer whose landing pad will be zeroed.
     */
    var zeroFarLanding = function(arena, pointer) {
        // Zero the far pointer landing pad if it exists.
        var typeBits = pointer.segment[pointer.position] & 7;
        if (typeBits === 2) {
            var doubleIncrement = (pointer.segment[pointer.position] & 4) << 1;
            arena._zero(far.next(arena, pointer), 8 + doubleIncrement);
        }
    };
    /*
     * Zero a pointer's entire branch.
     *
     * * arena BuilderArena - The pointer's parent arena.
     * * pointer Datum - The root of the branch to get zeroed.
     *
     * * RETURNS: Datum - The root of the branch that was zeroed.
     */
    var zero = function(arena, pointer) {
        if (isNull(pointer)) return;
        var layout = any.unsafe(arena, pointer);
        switch (layout.meta) {
          case 0:
            structure(arena, layout);
            break;

          case 1:
            list(arena, layout);
            break;
        }
        zeroFarLanding(arena, pointer);
        arena._zero(pointer, 8);
        return pointer;
    };
    return {
        pointer: zero,
        structure: structure,
        list: list
    };
});