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
    Data._set = function(arena, pointer, value) {
        var source, length;
        if (t === value._TYPE) {
            source = {
                segment: value._segment,
                position: value._begin
            };
            length = value._length;
        } else if (value instanceof Uint8Array) {
            source = {
                segment: value,
                position: 0
            };
            length = value.length;
        } else {
            throw new TypeError();
        }
        var blob = arena._preallocate(pointer.segment, length);
        arena._write(source, length, blob);
        layout.preallocated(pointer, blob, ct, length);
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