define([ "./reader/Arena", "./reader/primitives", "./builder/primitives" ], function(Arena, reader, builder) {
    var fromStruct = function(instance) {
        var arena = instance._arena;
        var count = arena._segments.length - 1;
        var segments = arena._segments.map(function(segment) {
            var s = segment.subarray(0, segment._position);
            s._id = segment._id;
            s._position = segment._position;
            return s;
        });
        /*
         * Header Length
         * count==0 => length==1 => 1 word
         * count==1 => length==2 => 1.5 -> 2 word
         * count==2 => length==3 => 2 word
         */
        var bytes = new Uint8Array((count & 65534) + 1 << 3);
        builder.uint32(count, bytes, 0);
        for (var i = 0; i < arena._segments.length; ++i) {
            builder.uint32(arena._segments[i]._position >>> 3, bytes, 1 + i << 2);
        }
        segments.unshift(bytes);
        return segments;
    };
    var toArena = function(blob) {
        if (blob.length < 4) {
            throw new RangeError();
        }
        var segments = [];
        var end = 4 + (reader.uint32(blob, 0) + 1 << 2);
        if (blob.length < end) {
            throw new RangeError();
        }
        var begin = end;
        for (var i = 0; i < end; i += 4) {
            var length = reader.uint32(blob, i);
            var s = blob.subarray(begin, begin + length);
            s._id = i;
            s._position = length;
            segments.push(s);
            begin += length;
        }
        return new Arena(segments);
    };
    return {
        fromStruct: fromStruct,
        toArena: toArena
    };
});