define([ "../../reader/layout/list", "../../reader/isNull", "../layout/list", "../copy/pointer", "../upgrade", "./field/index" ], function(reader, isNull, layout, copy, upgrade, field) {
    var deref = function(List) {
        List._deref = function(arena, pointer) {
            var ell = reader.unsafe(arena, pointer);
            if (ell.dataBytes < List._CT.dataBytes || ell.pointersBytes < List._CT.pointersBytes) {
                upgrade.list(arena, pointer, List._CT);
                return new List(arena, false, reader.unsafe(arena, pointer));
            }
            return new List(arena, false, ell);
        };
    };
    var init = function(List) {
        var stride = List._CT.dataBytes + List._CT.pointersBytes;
        List._init = function(arena, pointer, length) {
            var size = length * stride;
            var blob = arena._preallocate(pointer.segment, size);
            layout.preallocated(pointer, blob, List._CT, length);
            return new List(arena, false, reader.unsafe(arena, pointer));
        };
    };
    var initOrphan = function(List) {
        List._initOrphan = function(arena, length) {
            var size = length * (List._CT.dataBytes + List._CT.pointersBytes);
            var blob = arena._allocate(size);
            return new List(arena, true, {
                segment: blob.segment,
                begin: blob.position,
                length: length,
                dataBytes: List._CT.dataBytes,
                pointersBytes: List._CT.pointersBytes
            });
        };
    };
    var set = function(List) {
        List._set = function(arena, pointer, value) {
            if (value._TYPE.equiv(List._TYPE)) throw new TypeError();
            copy.setListPointer(value._arena, value._layout(), arena, pointer);
        };
    };
    return {
        deref: deref,
        init: init,
        initOrphan: initOrphan,
        set: set,
        install: function(Nonstruct) {
            deref(Nonstruct);
            init(Nonstruct);
            initOrphan(Nonstruct);
            set(Nonstruct);
            field.install(Nonstruct);
        }
    };
});