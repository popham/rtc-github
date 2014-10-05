define([ "../../reader/layout/list", "../layout/list" ], function(reader, list) {
    return function(List) {
        var stride = List._CT.dataBytes + List._CT.pointersBytes;
        return function(arena, pointer, length) {
            var size = length * stride;
            var blob = arena._preallocate(pointer.segment, size);
            list.preallocated(pointer, blob, ct, length);
            return new List(arena, reader.unsafe(arena, pointer), false);
        };
    };
});