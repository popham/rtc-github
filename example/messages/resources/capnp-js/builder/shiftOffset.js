define([ "../reader/primitives", "./primitives" ], function(decode, encode) {
    /*
     * Increment a list or structure pointer's offset.
     *
     * * pointer Datum - Position of a pointer.
     * * delta Int33 - Bytes offset increment applied to the pointer at
     *   `pointer`.
     */
    return function(pointer, delta) {
        var half = decode.uint32(pointer.segment, pointer.position);
        encode.uint32(/*
             * Non-bitshift to avoid possible truncation.  `delta` is word
             * aligned, so type bits remain intact after dividing.
             */
        half + delta / 2, pointer.segment, pointer.position);
    };
});