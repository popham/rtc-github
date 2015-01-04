define([ "../type", "./layout/structure", "./get", "./has", "./methods" ], function(type, structure, get, has, methods) {
    return function(preferredListEncoding, dataBytes, pointersBytes, hash) {
        var t = new type.Terminal();
        var ct = {
            meta: 0,
            dataBytes: dataBytes,
            pointersBytes: pointersBytes
        };
        var listCt = {
            meta: 1,
            layout: preferredListEncoding,
            dataBytes: dataBytes,
            pointersBytes: pointersBytes
        };
        var Structure = function(arena, depth, isOrphan, layout) {
            if (depth > arena.maxDepth) {
                throw new Error("Exceeded nesting depth limit");
            }
            this._arena = arena;
            this._depth = depth;
            this._isOrphan = isOrphan;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
            arena.limiter.read(layout.segment, layout.dataSection, layout.end - layout.dataSection);
        };
        Structure._TYPE = t;
        Structure._CT = ct;
        Structure._FIELD = {};
        Structure._HASH = hash;
        Structure._LIST_CT = listCt;
        Structure._deref = function(arena, pointer, depth) {
            return new Structure(arena, depth, false, structure.safe(arena, pointer));
        };
        get(Structure);
        has(Structure);
        Structure.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        return Structure;
    };
});