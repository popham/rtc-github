define([ "./primitives", "./isNull" ], function(primitives, isNull) {
    // Float conversion helpers
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    function throwOnInactive(actual, sought) {
        if (actual !== sought) throw new Error("Attempted to access an inactive union member");
    }
    return {
        throwOnInactive: throwOnInactive,
        bool: function(defaultValue, bytes, position, bitPosition) {
            return !!(primitives.bool(bytes, position, bitPosition) ^ defaultValue);
        },
        int8: function(defaultValue, bytes, position) {
            return primitives.int8(bytes, position) ^ defaultValue;
        },
        int16: function(defaultValue, bytes, position) {
            return primitives.int16(bytes, position) ^ defaultValue;
        },
        int32: function(defaultValue, bytes, position) {
            return primitives.int32(bytes, position) ^ defaultValue;
        },
        int64: function(defaultValue, bytes, position) {
            return [ primitives.int32(bytes, position + 4) ^ defaultValue[0], (primitives.uint32(bytes, position) ^ defaultValue[1]) >>> 0 ];
        },
        uint8: function(defaultValue, bytes, position) {
            return (primitives.uint8(bytes, position) ^ defaultValue) >>> 0;
        },
        uint16: function(defaultValue, bytes, position) {
            return (primitives.uint16(bytes, position) ^ defaultValue) >>> 0;
        },
        uint32: function(defaultValue, bytes, position) {
            return (primitives.uint32(bytes, position) ^ defaultValue) >>> 0;
        },
        uint64: function(defaultValue, bytes, position) {
            return [ (primitives.uint32(bytes, position + 4) ^ defaultValue[0]) >>> 0, (primitives.uint32(bytes, position) ^ defaultValue[1]) >>> 0 ];
        },
        /*
         * Float decoders use byte representation defaults instead of javascript
         * integrals.
         */
        float32: function(defaultBytes, bytes, position) {
            var i = 3;
            do {
                buffer[i] = bytes[position + i] ^ defaultBytes[i];
            } while (i--);
            return view.getFloat32(0, true);
        },
        float64: function(defaultBytes, bytes, position) {
            var i = 7;
            do {
                buffer[i] = bytes[position + i] ^ defaultBytes[i];
            } while (i--);
            return view.getFloat64(0, true);
        },
        pointer: {
            get: function(Type) {
                return function(defaultPosition, context, offset) {
                    var pointer = {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    };
                    if (pointer.position < context._end && !isNull(pointer)) return Type._deref(context._arena, pointer, context._depth + 1); else return context._pointerDefaults[defaultPosition];
                };
            },
            has: function() {
                return function(context, offset) {
                    var pointer = {
                        segment: context._segment,
                        position: context._pointersSection + offset
                    };
                    return pointer.position < context._end && !isNull(pointer);
                };
            }
        }
    };
});