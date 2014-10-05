define([ "../primitives" ], function(primitives) {
    var bytes = [ {
        dataBytes: 0,
        pointersBytes: 0
    }, {
        dataBytes: null,
        pointersBytes: null
    }, {
        dataBytes: 1,
        pointersBytes: 0
    }, {
        dataBytes: 2,
        pointersBytes: 0
    }, {
        dataBytes: 4,
        pointersBytes: 0
    }, {
        dataBytes: 8,
        pointersBytes: 0
    }, {
        dataBytes: 0,
        pointersBytes: 8
    } ];
    /*
     * Compute a list's layout from its pointer and blob.
     *
     * * tag Datum - A list's pointer.
     * * blob Datum - The blob corresponding to `tag`.
     *
     * * RETURNS: ListLayout
     */
    var layout = function(tag, blob) {
        var lo = primitives.uint32(tag.segment, tag.position + 4);
        var size = bytes[lo & 7];
        return {
            meta: 1,
            segment: blob.segment,
            begin: blob.position,
            length: lo >>> 3,
            dataBytes: size.dataBytes,
            pointersBytes: size.pointersBytes
        };
    };
    /*
     * Compute the layout of an intrasegment list pointer's list.  This function
     * also handles the targets of single-far pointers.
     *
     * * pointer Datum - Position of the intrasegment list pointer.
     *
     * * RETURNS: ListLayout
     */
    var intrasegment = function(pointer) {
        var half = primitives.int32(pointer.segment, pointer.position) & 4294967292;
        var blob = {
            segment: pointer.segment,
            position: pointer.position + 8 + half + half
        };
        return layout(pointer, blob);
    };
    /*
     * Compute the layout of an off-segment list's layout.  Single-far pointers
     * should be resolved externally and then layed-out by `intrasegment`.
     *
     * * tag Datum - The far pointer's tag word.
     * * blob Datum - The list's blob.
     *
     * * RETURNS: ListLayout
     */
    var intersegment = function(tag, blob) {
        return layout(tag, blob);
    };
    return {
        intrasegment: intrasegment,
        intersegment: intersegment
    };
});