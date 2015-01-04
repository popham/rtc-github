define([ "../reader/layout/structure", "../reader/methods", "./layout/structure", "./copy/pointer", "./fields", "./upgrade" ], function(reader, methods, builder, copy, fields, upgrade) {
    return function(Reader) {
        var t = Reader._TYPE;
        var ct = Reader._CT;
        var Structure = function(arena, isOrphan, layout) {
            this._arena = arena;
            this._isOrphan = isOrphan;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };
        Structure._READER = Reader;
        Structure._TYPE = t;
        Structure._CT = ct;
        Structure._FIELD = {};
        Structure._HASH = Reader._HASH;
        Structure._LIST_CT = Reader._LIST_CT;
        Structure._deref = function(arena, pointer) {
            var instance = new Structure(arena, false, reader.unsafe(arena, pointer));
            // Upgrade the blob if the pointer derived from an old version.
            var rt = instance._rt();
            if (rt.dataBytes < ct.dataBytes || rt.pointersBytes < ct.pointersBytes) {
                upgrade.structure(instance._arena, pointer, ct);
                return new Structure(arena, false, reader.unsafe(arena, pointer));
            }
            return instance;
        };
        Structure._init = function(arena, pointer) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._preallocate(pointer.segment, ctSize);
            builder.preallocated(pointer, blob, ct);
            return new Structure(arena, false, reader.unsafe(arena, pointer));
        };
        Structure._initOrphan = function(arena) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._allocateOrphan(ctSize);
            return new Structure(arena, true, {
                segment: blob.segment,
                dataSection: blob.position,
                pointersSection: blob.position + ct.dataBytes,
                end: blob.position + ctSize
            });
        };
        Structure._set = function(arena, pointer, value) {
            if (!value._TYPE.equiv(t)) throw new TypeError();
            copy.setStructPointer(value._arena, value._layout(), arena, pointer);
        };
        var adopt = fields.struct.adopt();
        Structure._FIELD.adopt = function(offset) {
            return function(value) {
                if (!value._TYPE.equiv(t)) throw new TypeError();
                if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
                if (!this._arena.isEquivTo(value._arena)) throw new ValueError("Cannot adopt from a different arena");
                adopt(this, offset, value);
            };
        };
        Structure._FIELD.unionAdopt = function(discr, offset) {
            return function(value) {
                if (!Structure._TYPE.equiv(value._TYPE)) throw new TypeError();
                if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
                if (!this._arena.isEquivTo(value._arena)) throw new ValueError("Cannot adopt from a different arena");
                this._setWhich(discr);
                adopt(this, offset, value);
            };
        };
        var disown = fields.pointer.disown(Structure);
        Structure._FIELD.disown = function(offset) {
            return function() {
                return disown(this, offset);
            };
        };
        Structure._FIELD.unionDisown = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return disown(this, offset);
            };
        };
        var disownReader = fields.pointer.disownReader(Reader);
        Structure._FIELD.disownReader = function(offset) {
            return function() {
                return disownReader(this, offset);
            };
        };
        Structure._FIELD.unionDisownReader = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return disownReader(this, offset);
            };
        };
        var get = fields.struct.get(Structure);
        Structure._FIELD.get = function(offset, defaultPosition) {
            return function() {
                return get(defaultPosition, this, offset);
            };
        };
        Structure._FIELD.unionGet = function(discr, offset, defaultPosition) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return get(defaultPosition, this, offset);
            };
        };
        var has = fields.pointer.has();
        Structure._FIELD.has = function(offset) {
            return function() {
                return has(this, offset);
            };
        };
        Structure._FIELD.unionHas = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return has(this, offset);
            };
        };
        var init = fields.struct.init(Structure);
        Structure._FIELD.init = function(offset) {
            return function() {
                return init(this, offset);
            };
        };
        Structure._FIELD.unionInit = function(discr, offset) {
            return function() {
                this._setWhich(discr);
                return init(this, offset);
            };
        };
        var set = fields.struct.set(Structure);
        Structure._FIELD.set = function(offset) {
            return function(value) {
                if (Structure._TYPE !== value._TYPE) throw new TypeError();
                set(this, offset, value);
            };
        };
        Structure._FIELD.unionSet = function(discr, offset) {
            return function(value) {
                if (Structure._TYPE !== value._TYPE) throw new TypeError();
                this._setWhich(discr);
                set(this, offset, value);
            };
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
                position: this._dataSection + position
            }, length);
        };
        return Structure;
    };
});