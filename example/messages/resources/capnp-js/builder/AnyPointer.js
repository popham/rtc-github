define([ "../reader/AnyPointer" ], function(Reader) {
    var Any = function(arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;
        this._depth = depth;
    };
    Any.prototype._bytes = Reader.prototype._bytes;
    Any.prototype.cast = function(Derefable) {
        /*
         * No increment on `depth` since the caller of `deref` has already
         * incremented.
         */
        return Derefable._deref(this._arena, this._pointer, this._depth);
    };
    Any._deref = function(arena, pointer, depth) {
        return new Any(arena, pointer, depth);
    };
    return Any;
});