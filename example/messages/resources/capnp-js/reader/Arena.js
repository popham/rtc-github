define([ "./Limiter" ], function(Limiter) {
    var Reader = function(segments, maxDepth, maxBytes) {
        /* No more than 64 chained pointer dereferences allowed by default. */
        this.maxDepth = maxDepth || 64;
        /* No more than 64 MiB of data to be dereferenced by default. */
        this.limiter = new Limiter(maxBytes || 67108864);
        this._segments = segments;
    };
    Reader.prototype.setMaxDepth = function(maxDepth) {
        this.maxDepth = maxDepth;
    };
    Reader.prototype.setMaxBytes = function(maxBytes) {
        this.limiter.maxBytes = maxBytes;
    };
    Reader.prototype.getSegment = function(id) {
        if (id >= this._segments.length) {
            throw new RangeError();
        }
        return this._segments[id];
    };
    return Reader;
});