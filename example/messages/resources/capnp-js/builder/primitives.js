define([], function() {
    // Float conversion helpers
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    var int8 = function(value, bytes, position) {
        bytes[position] = value;
    };
    var int16 = function(value, bytes, position) {
        bytes[position] = value;
        bytes[position + 1] = value >> 8;
    };
    var int32 = function(value, bytes, position) {
        bytes[position] = value;
        bytes[position + 1] = value >> 8;
        bytes[position + 2] = value >> 16;
        bytes[position + 3] = value >> 24;
    };
    return {
        bool: function(value, bytes, position, bitPosition) {
            // Mask out and then set the target bit.
            bytes[position] &= ~(1 << bitPosition);
            bytes[position] |= value << bitPosition;
        },
        int8: int8,
        int16: int16,
        int32: int32,
        uint8: int8,
        uint16: int16,
        uint32: int32,
        float32: function(value, bytes, position) {
            view.setFloat32(0, value, true);
            var i = 3;
            do {
                bytes[position + i] = buffer[i];
            } while (i--);
        },
        float64: function(value, bytes, position) {
            view.setFloat64(0, value, true);
            var i = 7;
            do {
                bytes[position + i] = buffer[i];
            } while (i--);
        }
    };
});