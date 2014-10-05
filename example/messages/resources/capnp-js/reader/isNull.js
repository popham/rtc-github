define([], function() {
    return function(pointer) {
        return !(pointer.segment[pointer.position] || pointer.segment[pointer.position + 1] || pointer.segment[pointer.position + 2] || pointer.segment[pointer.position + 3] || pointer.segment[pointer.position + 4] || pointer.segment[pointer.position + 5] || pointer.segment[pointer.position + 6] || pointer.segment[pointer.position + 7]);
    };
});