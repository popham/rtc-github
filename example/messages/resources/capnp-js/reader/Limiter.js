define([], function() {
    var Limiter = function(maxBytes) {
        this._read = 0;
        this.maxBytes = maxBytes;
    };
    /*
     * Maintain an unexceedable read limit and verify the corresponding data's
     * definedness.
     *
     * segment Uint8Array - Sequence of bytes.
     * start UInt32 - The first byte's position within `segment`.
     * byteCount UInt32 - The number of bytes to be read.
     */
    Limiter.prototype.read = function(segment, start, byteCount) {
        if (start < 0 || start + byteCount > segment._position) {
            throw new RangeError("Read outside of segment");
        }
        this._read += byteCount;
        if (this._read > this.maxBytes) {
            throw new Error("Read limit exceeded");
        }
    };
    Limiter.prototype.unread = function(bytes) {
        this._read -= bytes;
    };
    return Limiter;
});