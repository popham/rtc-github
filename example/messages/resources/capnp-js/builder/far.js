define([], function() {
    var far = function(pointer, blob, ab) {
        /* Non-bitshift to avoid possible sign-bit truncation. */
        var offset = blob.position / 8;
        var id = blob.segment._id;
        pointer.segment[pointer.position] = ab | offset << 3;
        pointer.segment[pointer.position + 1] = offset >>> 5;
        pointer.segment[pointer.position + 2] = offset >>> 13;
        pointer.segment[pointer.position + 3] = offset >>> 21;
        pointer.segment[pointer.position + 4] = id;
        pointer.segment[pointer.position + 5] = id >>> 8;
        pointer.segment[pointer.position + 6] = id >>> 16;
        pointer.segment[pointer.position + 7] = id >>> 24;
    };
    return {
        terminal: function(pointer, target) {
            // target - local pointer if no preterminal; blob otherwise
            far(pointer, target, 2);
        },
        preterminal: function(pointer, target) {
            far(pointer, target, 6);
        }
    };
});