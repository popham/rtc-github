define([ "../layout/list" ], function(list) {
    return function(arena, pointer, value) {
        var size = value._length * value._stride;
        var source = {
            segment: value._segment,
            position: value._begin
        };
        var rt = value._rt();
        if (rt.layout === 7) {
            size += 8;
            source.position -= 8;
        }
        var blob = arena._preallocate(value._segment, size);
        arena._write(source, size, blob);
        list.preallocated(pointer, blob, rt, value._length);
    };
});