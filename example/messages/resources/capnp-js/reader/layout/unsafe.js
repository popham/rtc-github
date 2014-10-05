define([ "../far" ], function(far) {
    /*
     * Compute a function that will map pointers to data type layouts.
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
         * Compute a pointer's layout.
         *
         * * arena ReaderArena - The hosting arena of `pointer`.
         * * pointer Datum - The position of the pointer whose layout is sought.
         *
         * * RETURNS: XLayout
         */
        return function(arena, pointer) {
            var lsb = pointer.segment[pointer.position];
            var typeBits = lsb & 3;
            if (typeBits === finalTypeBits) {
                // No indirection
                return intrasegment(pointer);
            } else {
                var land = far.next(arena, pointer);
                if (lsb & 4) {
                    // Double-far
                    var blob = far.next(arena, land);
                    var tag = {
                        segment: land.segment,
                        position: land.position + 8
                    };
                    return intersegment(tag, blob);
                } else {
                    // Single-far
                    return intrasegment(land);
                }
            }
        };
    };
});