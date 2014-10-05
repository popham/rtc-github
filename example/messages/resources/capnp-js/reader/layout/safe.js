define([ "../../datum", "../far" ], function(datum, far) {
    /*
     * Compute a function that will map pointers to data type layouts.  Broken
     * pointers will cause exceptions.
     *
     * * intrasegment Function:
     *   - pointer Datum - Position of the pointer whose data type layout is
     *     sought.
     *
     *   - RETURNS: XLayout
     *
     * * intersegment Function:
     *   - tag Datum - The far pointer's tag word.
     *   - blob Datum - The type's blob.
     *
     *   - RETURNS: XLayout
     *
     * * finalTypeBits UInt3 - Type bits to use for terminal type.
     *
     * * RETURNS: Function
     */
    return function(intrasegment, intersegment, finalTypeBits) {
        /*
         * Compute a pointer's layout.  Broken pointers cause exceptions.
         *
         * * arena ReaderArena - The hosting arena of `pointer`.
         * * pointer Datum - The position of the pointer whose layout is sought.
         *
         * RETURNS: XLayout
         */
        return function(arena, pointer) {
            datum.checkBounds(pointer);
            var lsb = pointer.segment[pointer.position];
            var typeBits = lsb & 3;
            if (typeBits === finalTypeBits) {
                // No indirection
                return intrasegment(pointer);
            } else if (typeBits === 2) {
                var land = far.next(arena, pointer);
                datum.checkBounds(land);
                if (lsb & 4) {
                    // Double indirection
                    var tag = {
                        segment: land.segment,
                        position: land.position + 8
                    };
                    datum.checkBounds(tag);
                    typeBits = tag.segment[tag.position] & 3;
                    if (typeBits === finalTypeBits) {
                        return intersegment(tag, far.next(arena, land));
                    } else {
                        throw new Error("Expected a pointer with type-bits of " + finalTypeBits);
                    }
                } else {
                    // Single indirection
                    typeBits = land.segment[land.position] & 3;
                    if (typeBits === finalTypeBits) {
                        return intrasegment(land);
                    } else {
                        throw new Error("Expected a pointer with type-bits of " + finalTypeBits);
                    }
                }
            } else {
                throw new Error("Expected a pointer with type-bits of " + finalTypeBits);
            }
        };
    };
});