define([ "../copy/deep", "../layout/list" ], function(copy, list) {
    return function(arena, pointer, value) {
        copy.setListPointer(value._arena, value._layout(), arena, pointer);
    };
});