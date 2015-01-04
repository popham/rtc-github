define([ "../../type", "./statics", "./methods" ], function(type, statics, methods) {
    var t = new type.Terminal();
    var ct = {
        meta: 1,
        layout: 0,
        dataBytes: 0,
        pointersBytes: 0
    };
    var Voids = function(arena, depth, isOrphan, list) {
        this._arena = arena;
        this._depth = depth;
        this._isOrphan = isOrphan;
        this._segment = list.segment;
        this._begin = 0;
        this._length = list.length;
        /*
         * While there may exist a new version, this version only provides
         * nulls.  There's no need to adapt stride, so just use static byte
         * counts.  These have not been moved to the prototype so that this list
         * maintains parallel structure with all of the others.
         */
        this._dataBytes = 0;
        this._pointersBytes = 0;
        this._stride = 0;
    };
    Voids._TYPE = t;
    Voids._CT = ct;
    Voids._FIELD = {};
    Voids._HASH = "L|V";
    Voids._B64_NULL = "AQAAAAAAAAA=";
    statics.install(Voids);
    Voids.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Voids.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        return null;
    };
    methods.install(Voids.prototype);
    return Voids;
});