define([ "../layout/list" ], function(layout) {
    return function(List) {
        return function(arena, pointer, value) {
            if (!value._isDisowned) {
                throw new ValueError("Cannot adopt a non-orphan");
            }
            var meta = value._rt();
            var blob = {
                segment: value._segment,
                position: value._begin
            };
            if (meta.layout === 7) {
                blob.position -= 8;
            }
            layout.nonpreallocated(arena, pointer, blob, meta, value._length);
            value._isDisowned = false;
        };
    };
});