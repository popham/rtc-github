define([ "../../reader/layout/any", "../../reader/list/meta", "../../reader/isNull", "../layout/structure", "../layout/list", "./blob" ], function(any, meta, isNull, structure, list, blob) {
    // Schemaless deep pointer copying.
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
    var setStructPointer = function(arena, layout, targetArena, target) {
        var b = targetArena._preallocate(target.segment, layout.end - layout.dataSection);
        blob.setStruct(arena, layout, targetArena, b);
        structure.preallocated(target, b, {
            meta: 0,
            dataBytes: layout.pointersSection - layout.dataSection,
            pointersBytes: layout.end - layout.pointersSection
        });
    };
    /*
     * Copy a list to a blob of memory and direct a pointer to it.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * target Datum - The location within `targetArena` to write a pointer that
     * dereferences to the copied list.
     */
    var setListPointer = function(arena, layout, targetArena, target) {
        var m = meta(layout);
        var b;
        if (m.layout === 7) {
            b = targetArena._preallocate(target.segment, 8 + layout.length * (layout.dataBytes + layout.pointersBytes));
        } else if (m.layout === 1) {
            b = targetArena._preallocate(target.segment, (layout.length >>> 3) + (layout.length & 7 ? 1 : 0));
        } else {
            b = targetArena._preallocate(target.segment, layout.length * (layout.dataBytes + layout.pointersBytes));
        }
        blob.setList(arena, layout, targetArena, b);
        list.preallocated(target, b, m, layout.length);
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
    var setAnyPointer = function(arena, source, targetArena, target) {
        if (!isNull(source)) {
            var layout = any.safe(arena, source);
            switch (layout.meta) {
              case 0:
                setStructPointer(arena, layout, targetArena, target);
                break;

              case 1:
                setListPointer(arena, layout, targetArena, target);
                break;
            }
        }
        return target;
    };
    return {
        setStructPointer: setStructPointer,
        setListPointer: setListPointer,
        setAnyPointer: setAnyPointer
    };
});