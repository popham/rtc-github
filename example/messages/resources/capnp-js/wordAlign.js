define([], function() {
    return function(bytes) {
        var pad = bytes & 7;
        if (pad) {
            // Word alignment
            bytes += 8 - pad;
        }
        return bytes;
    };
});