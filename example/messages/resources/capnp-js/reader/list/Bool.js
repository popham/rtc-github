define([ "../../type", "../primitives", "./statics", "./methods" ], function(type, primitives, statics, methods) {
    var t = new type.Terminal();
    var ct = {
        meta: 1,
        layout: 1,
        dataBytes: null,
        pointersBytes: null
    };
    var Bools = function(arena, depth, isOrphan, list) {
        this._arena = arena;
        this._depth = depth;
        this._isOrphan = isOrphan;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = list.dataBytes;
        this._pointersBytes = list.pointersBytes;
        this._stride = list.dataBytes + list.pointersBytes;
        arena.limiter.read(list.segment, list.begin, Math.ceil(list.length / 8));
    };
    Bools._TYPE = t;
    Bools._CT = ct;
    Bools._FIELD = {};
    Bools._HASH = "L|B";
    Bools._B64_NULL = "AQAAAAEAAAA=";
    statics.install(Bools);
    Bools.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Bools.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        if (this._dataBytes === null) {
            // Still single bits.
            return !!primitives.bool(this._segment, this._begin + (index >>> 3), index & 7);
        } else {
            /*
             * There exists a new version that has upgraded to non-single-bit
             * structures.
             */
            return !!primitives.bool(this._segment, this._begin + index * this._stride, 0);
        }
    };
    methods.install(Bools.prototype);
    return Bools;
});