define([ "../far", "./structure", "./list" ], function(far, structure, list) {
    var safe = function(arena, pointer) {
        var typeBits = pointer.segment[pointer.position] & 3;
        if (typeBits === 2) {
            var tag = far.tag(arena, pointer);
            typeBits = tag.segment[tag.position] & 3;
        }
        switch (typeBits) {
          case 0:
            return structure.safe(arena, pointer);

          case 1:
            return list.safe(arena, pointer);

          default:
            throw new Error("Expected a list or structure pointer");
        }
    };
    var unsafe = function(arena, pointer) {
        var typeBits = pointer.segment[pointer.position] & 3;
        if (typeBits === 2) {
            var tag = far.tag(arena, pointer);
            typeBits = tag.segment[tag.position] & 3;
        }
        switch (typeBits) {
          case 0:
            return structure.unsafe(arena, pointer);

          case 1:
            return list.unsafe(arena, pointer);
        }
    };
    return {
        safe: safe,
        unsafe: unsafe
    };
});