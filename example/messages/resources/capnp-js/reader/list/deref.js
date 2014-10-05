define([ "../layout/list" ], function(layout) {
    return function(List) {
        return function(arena, pointer, depth) {
            return new List(arena, depth, layout.safe(arena, pointer));
        };
    };
});