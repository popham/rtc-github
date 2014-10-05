define([ "./statics", "./methods" ], function(statics, methods) {
    return function(Reader, encoder) {
        var t = Reader._TYPE;
        var ct = Reader._CT;
        var Primitives = function(arena, list, isDisowned) {
            this._arena = arena;
            this._isDisowned = isDisowned;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = list.dataBytes + list.pointersBytes;
        };
        Primitives._TYPE = t;
        Primitives._CT = ct;
        statics.install(Primitives);
        Primitives.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Primitives.prototype.get = Reader.prototype.get;
        Primitives.prototype.set = function(index, value) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            encoder(value, this._segment, this._begin + index * this._stride);
        };
        return Primitives;
    };
});