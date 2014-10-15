define([ "../../reader/layout/list", "../upgrade" ], function(reader, upgrade) {
    return function(List) {
        return function(arena, pointer) {
            var instance = new List(arena, reader.unsafe(arena, pointer), false);
            var rt = instance._rt();
            if (rt.dataBytes < List._CT.dataBytes || rt.pointersBytes < List._CT.pointersBytes) {
                upgrade.list(arena, pointer, List._CT);
                return new List(arena, reader.unsafe(arena, pointer), false);
            }
            return instance;
        };
    };
});