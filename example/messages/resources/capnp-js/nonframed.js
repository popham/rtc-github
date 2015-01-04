define([ "./reader/Arena", "./builder/Allocator", "./builder/copy/pointer" ], function(Arena, Allocator, copy) {
    var allocator = new Allocator();
    var fromStruct = function(instance) {
        var layout = instance._layout();
        if (layout.meta !== 0) throw new TypeError("Message must have a structure as its root");
        var arena = instance._arena;
        var singleton;
        if (arena._segments.length !== 1) {
            // Compute upper bound on necessary arena size:
            // * Single hop far pointer implies 8 bytes of slop.
            // * Double hop far pointer implies 16 bytes of slop.
            var size = 0;
            arena._segments.forEach(function(s) {
                size += s._position;
            });
            var nonframedArena = allocator.createArena(size);
            copy.setStructPointer(arena, layout, nonframedArena, nonframedArena._root());
            singleton = nonframedArena.getSegment(0);
        } else {
            singleton = arena.getSegment(0);
        }
        return singleton.subarray(0, singleton._position);
    };
    var toArena = function(blob) {
        blob = blob.subarray();
        blob._id = 0;
        blob._position = blob.length;
        return new Arena([ blob ]);
    };
    return {
        fromStruct: fromStruct,
        toArena: toArena
    };
});