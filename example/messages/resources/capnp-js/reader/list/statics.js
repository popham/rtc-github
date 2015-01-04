define([ "../layout/list", "../get", "../has" ], function(layout, get, has) {
    var deref = function(List) {
        List._deref = function(arena, pointer, depth) {
            return new List(arena, depth, false, layout.safe(arena, pointer));
        };
    };
    var installFields = function(Nonstruct) {
        get(Nonstruct);
        has(Nonstruct);
    };
    return {
        deref: deref,
        field: {
            get: get,
            has: has,
            install: installFields
        },
        install: function(Nonstruct) {
            deref(Nonstruct);
            installFields(Nonstruct);
        }
    };
});