define([], function() {
    return {
        checkBounds: function(datum) {
            if (datum.position < 0 || datum.position >= datum.segment._position) {
                throw new RangeError();
            }
        }
    };
});