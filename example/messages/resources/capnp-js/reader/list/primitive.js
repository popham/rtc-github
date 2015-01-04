define([ "../../type", "./statics", "./methods" ], function(type, statics, methods) {
    return function(decoder, ct, hash) {
        var t = new type.Terminal();
        var Primitives = function(arena, depth, isOrphan, layout) {
            this._arena = arena;
            this._depth = depth;
            this._isOrphan = isOrphan;
            this._segment = layout.segment;
            this._begin = layout.begin;
            this._length = layout.length;
            this._dataBytes = layout.dataBytes;
            this._pointersBytes = layout.pointersBytes;
            this._stride = layout.dataBytes + layout.pointersBytes;
            arena.limiter.read(layout.segment, layout.begin, layout.dataBytes * layout.length);
        };
        Primitives._TYPE = t;
        Primitives._CT = ct;
        Primitives._FIELD = {};
        Primitives._HASH = hash;
        switch (ct.layout) {
          case 2:
            Primitives._B64_NULL = "AQAAAAIAAAA=";
            break;

          case 3:
            Primitives._B64_NULL = "AQAAAAMAAAA=";
            break;

          case 4:
            Primitives._B64_NULL = "AQAAAAQAAAA=";
            break;

          case 5:
            Primitives._B64_NULL = "AQAAAAUAAAA=";
            break;

          default:
            throw new Error("Unexpected primitive layout");
        }
        statics.install(Primitives);
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