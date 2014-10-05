define([], function() {
    // Float conversion helpers
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    var int32 = function(bytes, position) {
        return bytes[position] | bytes[position + 1] << 8 | bytes[position + 2] << 16 | bytes[position + 3] << 24;
    };
    uint32 = function(bytes, position) {
        return (bytes[position] | bytes[position + 1] << 8 | bytes[position + 2] << 16 | bytes[position + 3] << 24) >>> 0;
    };
    return {
        bool: function(bytes, position, bitPosition) {
            return bytes[position] >>> bitPosition & 1 | 0;
        },
        int8: function(bytes, position) {
            return bytes[position] << 24 >> 24;
        },
        int16: function(bytes, position) {
            return (bytes[position] << 16 | bytes[position + 1] << 24) >> 16;
        },
        int32: int32,
        int64: function(bytes, position) {
            return [ int32(bytes, position + 4), uint32(bytes, position) ];
        },
        uint8: function(bytes, position) {
            return bytes[position] >>> 0;
        },
        uint16: function(bytes, position) {
            return (bytes[position] | bytes[position + 1] << 8) >>> 0;
        },
        uint32: uint32,
        uint64: function(bytes, position) {
            return [ uint32(bytes, position + 4), uint32(bytes, position) ];
        },
        float32: function(bytes, position) {
            var i = 3;
            do {
                buffer[i] = bytes[position + i];
            } while (i--);
            return view.getFloat32(0, true);
        },
        float64: function(bytes, position) {
            var i = 7;
            do {
                buffer[i] = bytes[position + i];
            } while (i--);
            return view.getFloat64(0, true);
        }
    };
});