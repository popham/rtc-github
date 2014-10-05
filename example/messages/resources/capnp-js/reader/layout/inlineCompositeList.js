define([ "../primitives", "./structure" ], function(primitives, structure) {
    /*
     * Compute a list's layout from its leading tag.
     *
     * * blob Datum - Start of an inline composite list's blob.
     *
     * RETURNS: ListLayout
     */
    var inlineLayout = function(blob) {
        return {
            meta: 1,
            segment: blob.segment,
            begin: blob.position + 8,
            length: primitives.uint32(blob.segment, blob.position) >>> 2,
            dataBytes: structure.dataBytes(blob),
            pointersBytes: structure.pointersBytes(blob)
        };
    };
    /*
     * Compute the layout of an intrasegment list pointer's list.  This function
     * also handles the targets of single-far pointers.
     *
     * * pointer Datum - Position of the pointer.
     *
     * RETURNS: ListLayout
     */
    var intrasegment = function(pointer) {
        var half = primitives.int32(pointer.segment, pointer.position) & 4294967292;
        var blob = {
            segment: pointer.segment,
            position: pointer.position + 8 + half + half
        };
        return inlineLayout(blob);
    };
    /*
     * Compute the layout of an off-segment list's layout.  Single-far pointers
     * should be resolved externally and then layed-out by `intrasegment`.
     *
     * * tag Datum - The far pointer's tag word.
     * * blob Datum - The list's blob.
     *
     * RETURNS: ListLayout
     */
    var intersegment = function(tag, blob) {
        return inlineLayout(blob);
    };
    return {
        intrasegment: intrasegment,
        intersegment: intersegment
    };
});