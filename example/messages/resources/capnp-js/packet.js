define([ "./reader/Arena", "./builder/Allocator", "./builder/copy/deep" ], function(Arena, Allocator, deep) {
    var allocator = new Allocator();
    var fromStruct = function(instance) {
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
            var packetArena = allocator.createArena(size);
            deep.setStructurePointer(arena, instance._layout(), packetArena, packetArena._root());
            singleton = packetArena.getSegment(0);
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