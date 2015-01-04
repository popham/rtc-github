define([ "../../type", "./statics", "./methods" ], function(type, statics, methods) {
    /*
     * Lists of dereferencable stuff, excluding structures.  E.g. Text, Data,
     * List(X), AnyPointer.
     */
    return function(Nonstruct) {
        var t = new type.List(Nonstruct._TYPE);
        var ct = {
            meta: 1,
            layout: 6,
            dataBytes: 0,
            pointersBytes: 8
        };
        var Pointers = function(arena, depth, isOrphan, list) {
            if (depth > arena.maxDepth) {
                throw new Error("Exceeded nesting depth limit");
            }
            this._arena = arena;
            this._depth = depth;
            this._isOrphan = isOrphan;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = this._dataBytes + this._pointersBytes;
            arena.limiter.read(list.segment, list.begin, list.length << 3);
        };
        Pointers._TYPE = t;
        Pointers._CT = ct;
        Pointers._FIELD = {};
        Pointers._HASH = "L|" + Nonstruct._HASH;
        Pointers._B64_NULL = "AQAAAAYAAAA=";
        statics.install(Pointers);
        Pointers.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Pointers.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return Nonstruct._deref(this._arena, {
                segment: this._segment,
                position: this._begin + this._dataBytes + index * this._stride
            }, this._depth + 1);
        };
        methods.install(Pointers.prototype);
        return Pointers;
    };
});