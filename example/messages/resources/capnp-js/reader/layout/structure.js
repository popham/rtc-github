define([ "../primitives", "./safe", "./unsafe" ], function(primitives, safe, unsafe) {
    /*
     * Compute the number of bytes in a structure's data section.
     *
     * * pointer Datum - A pointer to the structure whose data section byte
     *   count is sought.
     *
     * RETURNS: UInt19
     */
    var dataBytes = function(pointer) {
        return primitives.uint16(pointer.segment, pointer.position + 4) << 3;
    };
    /*
     * Compute the number of bytes in a structure's pointer section.
     *
     * * pointer Datum - A pointer to the structure whose pointer section byte
     *   count is sought.
     *
     * RETURNS: UInt19
     */
    var pointersBytes = function(pointer) {
        return primitives.uint16(pointer.segment, pointer.position + 6) << 3;
    };
    /*
     * Compute a structure's layout from its pointer and blob.
     *
     * * tag Datum - A structure's pointer.
     * * blob Datum - The blob corresponding to `tag`.
     *
     * RETURNS: StructureLayout
     */
    var layout = function(tag, blob) {
        var pointers = blob.position + dataBytes(tag);
        return {
            meta: 0,
            segment: blob.segment,
            dataSection: blob.position,
            pointersSection: pointers,
            end: pointers + pointersBytes(tag)
        };
    };
    /*
     * Compute the layout of a blob from its metadata.
     */
    var meta = function(blob, meta_) {
        var pointers = blob.position + meta_.dataBytes;
        return {
            meta: 0,
            segment: blob.segment,
            dataSection: blob.position,
            pointersSection: pointers,
            end: pointers + meta_.pointersBytes
        };
    };
    /*
     * Compute the layout of an intrasegment structure pointer's structure.
     * This function also handles the targets of single-far pointers.
     *
     * * pointer Datum - Position of the intrasegment structure pointer.
     *
     * RETURNS: StructureLayout
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
     * Compute the layout of an off-segment structure's layout.  Single-far
     * pointers should be resolved externally and then layed-out by
     * `intrasegment`.
     *
     * * tag Datum - The far pointer's tag word.
     * * blob Datum - The structure's blob.
     *
     * RETURNS: StructureLayout
     */
    var intersegment = function(tag, blob) {
        return layout(tag, blob);
    };
    return {
        safe: safe(intrasegment, intersegment, 0),
        unsafe: unsafe(intrasegment, intersegment, 0),
        meta: meta,
        intrasegment: intrasegment,
        intersegment: intersegment,
        dataBytes: dataBytes,
        pointersBytes: pointersBytes
    };
});