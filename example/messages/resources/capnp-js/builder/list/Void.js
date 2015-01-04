define([ "../../reader/list/Void", "./statics", "./methods" ], function(Reader, statics, methods) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Voids = function(arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = layout.dataBytes;
        this._pointersBytes = layout.pointersBytes;
        this._stride = layout.dataBytes + layout.pointersBytes;
    };
    Voids._READER = Reader;
    Voids._TYPE = t;
    Voids._CT = ct;
    Voids._FIELD = {};
    Voids._HASH = Reader._HASH;
    statics.install(Voids);
    Voids.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    methods.install(Voids.prototype);
    Voids.prototype.get = Reader.prototype.get;
    return Voids;
});