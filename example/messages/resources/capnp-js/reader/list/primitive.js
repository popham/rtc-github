define([ "../../type", "./deref", "./methods" ], function(type, deref, methods) {
    return function(decoder, ct) {
        var t = new type.Terminal();
        var Primitives = function(arena, depth, list) {
            this._arena = arena;
            this._depth = depth;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = list.dataBytes + list.pointersBytes;
            arena.limiter.read(list.segment, list.begin, list.dataBytes * list.length);
        };
        Primitives._TYPE = t;
        Primitives._CT = Primitives.prototype._CT = ct;
        Primitives._deref = deref(Primitives);
        Primitives.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Primitives.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return decoder(this._segment, this._begin + index * this._stride);
        };
        methods.install(Primitives.prototype);
        return Primitives;
    };
});