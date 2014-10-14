define([ "../../reader/layout/list" ], function(layout) {
    return function(List) {
        return function(arena, pointer) {
            return new List(arena, layout.unsafe(arena, pointer), false);
        };
    };
});