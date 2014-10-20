define([ "./reader/Arena", "./reader/primitives", "./builder/primitives" ], function(Arena, reader, builder) {
    /*
     * Implement stream serialization from Capnproto reference implementation.
     *
     * * instance Structure - Structure to derive chunks from.
     *
     * RETURNS: Array - The array's first element is the stream header.  The
     * remaining elements are arena segments.
     */
    var fromStruct = function(instance) {
        var arena = instance._arena;
        var count = arena._segments.length;
        /*
         * Header Length
         * count==1 => 1 word
         * count==2 => 1.5 -> 2 word
         * count==3 => 2 word
         */
        var headerLength = (count + 2 & 65534) << 2;
        var header = new Uint8Array(headerLength);
        builder.uint32(count - 1, header, 0);
        var segments = arena._segments.map(function(segment, i) {
            builder.uint32(segment._position, header, 1 + i << 2);
            return segment.subarray(0, segment._position);
        });
        segments.unshift(header);
        return segments;
    };
    /*
     * Deserialize a stream to an Arena.
     *
     * * headerPlusSegments Array - See return of `fromStruct`.
     *
     * RETURNS: ReaderArena
     */
    var toArena = function(headerPlusSegments) {
        if (headerPlusSegments.length < 2) {
            throw new RangeError();
        }
        var header = headerPlusSegments[0];
        for (var i = 1; i < headerPlusSegments.length; ++i) {
            var segment = headerPlusSegments[i];
            segment[i]._id = i - 1;
            segment[i]._position = segment.length;
        }
        return new Arena(headerPlusSegments.slice(1));
    };
    return {
        fromStruct: fromStruct,
        toArena: toArena
    };
});