define([ "../reader/Data", "./list/statics", "./list/methods", "./layout/list" ], function(Reader, statics, methods, layout) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Data = function(arena, list, isDisowned) {
        this._arena = arena;
        this._isDisowned = isDisowned;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Data._READER = Reader;
    Data._CT = ct;
    Data._TYPE = t;
    statics.install(Data);
    Data._setParams = function(value) {
        if (t === value._TYPE) {
            return {
                source: {
                    segment: value._segment,
                    position: value._begin
                },
                length: value._length
            };
        } else if (value instanceof Uint8Array) {
            return {
                source: {
                    segment: value,
                    position: 0
                },
                length: value.length
            };
        } else {
            throw new TypeError();
        }
    };
    Data._set = function(arena, pointer, params) {
        var blob = arena._preallocate(pointer.segment, params.length);
        arena._write(params.source, params.length, blob);
        layout.preallocated(pointer, blob, ct, params.length);
    };
    Data.prototype = {
        _CT: ct,
        _TYPE: t,
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