define([ "./statics", "./methods" ], function(statics, methods) {
    return function(Reader, encoder) {
        var t = Reader._TYPE;
        var ct = Reader._CT;
        var Primitives = function(arena, isOrphan, layout) {
            this._arena = arena;
            this._isOrphan = isOrphan;
            this._segment = layout.segment;
            this._begin = layout.begin;
            this._length = layout.length;
            this._dataBytes = layout.dataBytes;
            this._pointersBytes = layout.pointersBytes;
            this._stride = layout.dataBytes + layout.pointersBytes;
        };
        Primitives._TYPE = t;
        Primitives._CT = ct;
        Primitives._FIELD = {};
        Primitives._HASH = Reader._HASH;
        statics.install(Primitives);
        Primitives.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        methods.install(Primitives.prototype);
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