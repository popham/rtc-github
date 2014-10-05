define([ "../type", "./list/deref", "./list/methods" ], function(type, deref, methods) {
    var t = new type.Terminal();
    var ct = {
        meta: 1,
        layout: 2,
        dataBytes: 1,
        pointersBytes: 0
    };
    var Data = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
        this._arena.limiter.read(list.segment, list.begin, list.length);
    };
    Data._TYPE = t;
    Data._CT = ct;
    Data._deref = deref(Data);
    Data.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Data.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        return this._segment[this._begin + index];
    };
    Data.prototype.raw = function() {
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    methods.install(Data.prototype);
    return Data;
});