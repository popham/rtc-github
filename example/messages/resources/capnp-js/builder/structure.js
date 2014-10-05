define([ "../reader/layout/structure", "../reader/methods", "./layout/structure", "./upgrade" ], function(reader, methods, builder, upgrade) {
    return function(Reader) {
        var t = Reader._TYPE;
        var ct = Reader._CT;
        var listCt = Reader._LIST_CT;
        var Structure = function(arena, layout, isDisowned) {
            this._arena = arena;
            this._isDisowned = isDisowned;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };
        Structure._READER = Reader;
        Structure._TYPE = t;
        Structure._CT = ct;
        Structure._LIST_CT = listCt;
        Structure._adopt = function(arena, pointer, value) {
            if (!value._isDisowned) {
                throw new ValueError("Cannot adopt a non-orphan");
            }
            builder.nonpreallocated(arena, pointer, {
                segment: value._segment,
                position: value._dataSection
            }, value._rt());
            value._isDisowned = false;
        };
        Structure._deref = function(arena, pointer) {
            var instance = new Structure(arena, reader.unsafe(arena, pointer), false);
            // Upgrade the blob if the pointer derived from an old version.
            var rt = instance._rt();
            if (rt.dataBytes < ct.dataBytes || rt.pointersBytes < ct.pointersBytes) {
                upgrade.structure(instance._arena, pointer, ct);
                return new Structure(arena, reader.unsafe(arena, pointer), false);
            }
            return instance;
        };
        Structure._init = function(arena, pointer) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._preallocate(pointer.segment, ctSize);
            builder.preallocated(pointer, blob, ct);
            return new Structure(arena, reader.unsafe(arena, pointer), false);
        };
        Structure._initOrphan = function(arena) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._allocateOrphan(ctSize);
            return new Structure(arena, {
                segment: blob.segment,
                dataSection: blob.position,
                pointersSection: blob.position + ct.dataBytes,
                end: blob.position + ctSize
            }, true);
        };
        Structure._set = function(arena, pointer, value) {
            if (t !== value._TYPE) {
                throw new TypeError();
            }
            var source = {
                segment: value._segment,
                position: value._dataSection
            };
            var size = value._end - value._dataSection;
            var blob = arena._preallocate(pointer.segment, size);
            arena._write(source, size, blob);
            builder.preallocated(pointer, blob, value._rt());
        };
        Structure.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Structure.prototype._maskData = function(position, mask) {
            this._segment[this._dataSection + position] &= mask;
        };
        Structure.prototype._zeroData = function(position, length) {
            this._arena._zero({
                segment: this._segment,
                position: position
            }, length);
        };
        return Structure;
    };
});