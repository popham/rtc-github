define([ "../reader/isNull", "./copy/pointer", "./primitives", "./layout/index" ], function(isNull, copy, primitives, layout) {
    // Float conversion helpers
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    function throwOnInactive(actual, sought) {
        if (actual !== sought) throw new Error("Attempted to access an inactive union member");
    }
    return {
        throwOnInactive: throwOnInactive,
        bool: function(value, defaultValue, bytes, position, bitPosition) {
            primitives.bool(!!value ^ defaultValue, bytes, position, bitPosition);
        },
        int8: function(value, defaultValue, bytes, position) {
            primitives.int8(value ^ defaultValue, bytes, position);
        },
        int16: function(value, defaultValue, bytes, position) {
            primitives.int16(value ^ defaultValue, bytes, position);
        },
        int32: function(value, defaultValue, bytes, position) {
            primitives.int32(value ^ defaultValue, bytes, position);
        },
        int64: function(value, defaultValue, bytes, position) {
            primitives.int32(value[0] ^ defaultValue[0], bytes, position + 4);
            primitives.int32(value[1] ^ defaultValue[1], bytes, position);
        },
        uint8: function(value, defaultValue, bytes, position) {
            primitives.uint8(value ^ defaultValue, bytes, position);
        },
        uint16: function(value, defaultValue, bytes, position) {
            primitives.uint16(value ^ defaultValue, bytes, position);
        },
        uint32: function(value, defaultValue, bytes, position) {
            primitives.uint32(value ^ defaultValue, bytes, position);
        },
        uint64: function(value, defaultValue, bytes, position) {
            primitives.uint32(value[0] ^ defaultValue[0], bytes, position + 4);
            primitives.uint32(value[1] ^ defaultValue[1], bytes, position);
        },
        /*
         * Float encoders use byte representation defaults instead of javascript
         * integrals.
         */
        float32: function(value, defaultBytes, bytes, position) {
            view.setFloat32(0, value, true);
            var i = 3;
            do {
                bytes[position + i] = buffer[i] ^ defaultBytes[i];
            } while (i--);
        },
        float64: function(value, defaultBytes, bytes, position) {
            view.setFloat64(0, value, true);
            var i = 7;
            do {
                bytes[position + i] = buffer[i] ^ defaultBytes[i];
            } while (i--);
        },
        pointer: {
            disown: function(Type) {
                return function(context, offset) {
                    var pointer = {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    };
                    var instance = Type._deref(context._arena, pointer);
                    context._arena._zero(pointer, 8);
                    instance._isOrphan = true;
                    return instance;
                };
            },
            disownReader: function(ReaderType) {
                return function(context, offset) {
                    var pointer = {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    };
                    var instance = Type._deref(context._arena, pointer, 0);
                    context._arena._zero(pointer, 8);
                    instance._isOrphan = true;
                    return instance;
                };
            },
            has: function() {
                return function(context, offset) {
                    return !isNull({
                        segment: context._segment,
                        position: context._pointersSection + offset
                    });
                };
            }
        },
        list: {
            adopt: function() {
                return function(context, offset, value) {
                    var meta = value._rt();
                    var blob = {
                        segment: value._segment,
                        position: value._begin
                    };
                    if (meta.layout === 7) {
                        blob.position -= 8;
                    }
                    layout.list.nonpreallocated(context._arena, {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    }, blob, meta, value._length);
                    value._isOrphan = false;
                };
            },
            get: function(List) {
                return function(defaultPosition, context, offset) {
                    var pointer = {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    };
                    if (isNull(pointer)) {
                        var d = context._pointerDefaults[defaultPosition];
                        copy.setListPointer(d._arena, d._layout(), context._arena, pointer);
                    }
                    return List._deref(context._arena, pointer);
                };
            },
            init: function(List) {
                return function(context, offset, length) {
                    return List._init(context._arena, {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    }, length);
                };
            },
            set: function(List) {
                return function(context, offset, value) {
                    copy.setListPointer(value._arena, value._layout(), context._arena, {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    });
                };
            }
        },
        struct: {
            adopt: function() {
                return function(context, offset, value) {
                    layout.struct.nonpreallocated(context._arena, {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    }, {
                        segment: value._segment,
                        position: value._dataSection
                    }, value._rt());
                    value._isOrphan = false;
                };
            },
            get: function(Structure) {
                return function(defaultPosition, context, offset) {
                    var pointer = {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    };
                    if (isNull(pointer)) {
                        var d = context._pointerDefaults[defaultPosition];
                        copy.setStructPointer(d._arena, d._layout(), context._arena, pointer);
                    }
                    return Structure._deref(context._arena, pointer);
                };
            },
            init: function(Structure) {
                return function(context, offset) {
                    return Structure._init(context._arena, {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    });
                };
            },
            set: function(Structure) {
                return function(context, offset, value) {
                    copy.setStructPointer(value._arena, value._layout(), context._arena, {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    });
                };
            }
        }
    };
});