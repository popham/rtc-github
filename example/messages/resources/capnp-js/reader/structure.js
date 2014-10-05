define([ "../type", "./layout/structure", "./list/structure", "./methods" ], function(type, structure, list, methods) {
    return function(preferredListEncoding, dataBytes, pointersBytes) {
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
        var Structure = function(arena, depth, layout) {
            if (depth > arena.maxDepth) {
                throw new Error("Exceeded nesting depth limit");
            }
            this._arena = arena;
            this._depth = depth;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
            arena.limiter.read(layout.segment, layout.dataSection, layout.end - layout.dataSection);
        };
        Structure._TYPE = t;
        Structure._CT = ct;
        Structure._LIST_CT = listCt;
        Structure._deref = function(arena, pointer, depth) {
            return new Structure(arena, depth, structure.safe(arena, pointer));
        };
        Structure.prototype = {
            _TYPE: t,
            _CT: ct,
            _LIST_CT: listCt,
            _rt: methods.rt,
            _layout: methods.layout
        };
        return Structure;
    };
});