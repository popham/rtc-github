define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope'], function(Allocator, reader, scope) {
    var constants = {};
    var allocator = new Allocator();
    constants["0xfb7024301714f2d2"] = (function() {
        var arena = allocator._fromBase64("AQAAAAcAAAAAAAAAAQABAA==").asReader();
        return reader.lists.structure(scope['0x95570979dae93deb'])._deref(arena, {
            segment: arena.getSegment(0),
            position: 0
        }, 0);
    })();
    return constants;
});