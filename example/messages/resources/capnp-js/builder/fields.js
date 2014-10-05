define([ "./primitives" ], function(primitives) {
    // Float conversion helpers
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    return {
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
        }
    };
});