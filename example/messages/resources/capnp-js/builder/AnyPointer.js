define([ "../reader/AnyPointer", "../reader/isNull", "../reader/list/meta", "../reader/layout/any", "./copy/pointer", "./layout/index", "./fields", "./Data", "./Text" ], function(Reader, isNull, listMeta, any, copy, layout, fields, Data, Text) {
    var t = Reader._TYPE;
    var adoptLayout = function(context, ell) {
        if (ell.meta === 1) {
            var meta = listMeta(ell);
            layout.list.nonpreallocated(context._arena, context._pointer, {
                segment: ell.segment,
                position: ell.begin - (meta.layout === 7 ? 8 : 0)
            }, meta, ell.length);
        } else {
            layout.structure.nonpreallocated(context._arena, context._pointer, {
                segment: ell.segment,
                position: ell.dataSection
            }, {
                meta: 0,
                dataBytes: ell.pointersSection - ell.dataSection,
                pointersBytes: ell.end - ell.pointersSection
            });
        }
    };
    var disown = function(context) {
        var instance = Any._deref(context._arena, context._pointer);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;
        return instance;
    };
    var disownReadOnly = function(context) {
        var instance = Any._READER._deref(context._arena, context._pointer, 0);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;
        return instance;
    };
    var disownAs = function(Type, context) {
        if (isNull(context._pointer) && Type._CT.meta === 1) throw new ValueError("Cannot disown a null list pointer");
        var instance = Type._deref(context._arena, context._pointer);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;
        return instance;
    };
    var disownAsReadOnly = function(Type, context) {
        if (isNull(context._pointer) && Type._CT.meta === 1) throw new ValueError("Cannot disown a null list pointer");
        var instance = Type._READER._deref(context._arena, context._pointer, 0);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;
        return instance;
    };
    var set = function(arena, pointer, value) {
        if (value._arena.IS_READER) console.log("No read limits have been applied :(");
        var ell = value._layout();
        if (ell.meta === 1) {
            copy.pointer.setListPointer(value._arena, ell, arena, pointer);
        } else {
            copy.pointer.setStructPointer(value._arena, ell, arena, pointer);
        }
    };
    var Field = function(discr, parent, pointer) {
        this._arena = parent._arena;
        this._isOrphan = false;
        this._discr = discr;
        this._parent = parent;
        this._pointer = pointer;
    };
    Field._READER = Reader._FIELD;
    Field._TYPE = t;
    Field.get = function(offset, defaultPosition) {
        return function() {
            return new Field(null, this, {
                segment: this._segment,
                position: this._pointersSection + offset
            });
        };
    };
    Field.unionGet = function(discr, offset, defaultPosition) {
        return function() {
            fields.throwOnInactive(this.which(), discr);
            return new Field(discr, this, {
                segment: this._segment,
                position: this._pointersSection + offset
            });
        };
    };
    var has = fields.pointer.has();
    Field.has = function(offset) {
        return function() {
            return has(this, offset);
        };
    };
    Field.unionHas = function(discr, offset) {
        return function() {
            fields.throwOnInactive(this.which(), discr);
            return has(this, offset);
        };
    };
    Field.unionInit = function(discr, offset) {
        return function() {
            this._setWhich(discr);
            return new Field(discr, this, {
                segment: this._segment,
                position: this._pointersSection + offset
            });
        };
    };
    Field.set = function(offset) {
        return function(value) {
            if (value._layout === undefined) throw new TypeError();
            set(this._arena, {
                segment: this._segment,
                position: this._pointersSection + offset
            }, value);
        };
    };
    Field.unionSet = function(discr, offset) {
        return function(value) {
            if (value._layout === undefined) throw new TypeError();
            this._setWhich(discr);
            set(this._arena, {
                segment: this._segment,
                position: this._pointersSection + offset
            }, value);
        };
    };
    Field.prototype = {
        _TYPE: t,
        _layout: function() {
            return any.safe(this._arena, this._pointer);
        }
    };
    Field.prototype.adopt = function(value) {
        if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
        if (!value._arena.isEquivTo(this._arena)) throw new ValueError("Cannot adopt from a different arena");
        if (this._discr) this._parent._setWhich(this._discr);
        adoptLayout(this, value._layout());
    };
    Field.prototype.disown = function() {
        return disown(this);
    };
    Field.prototype.disownAs = function(Type) {
        return disownAs(Type, this);
    };
    Field.prototype.disownReadOnly = function() {
        return disownReadOnly(this);
    };
    Field.prototype.disownAsReadOnly = function(Type) {
        return disownAsReadOnly(Type, this);
    };
    Field.prototype.getAs = function(Derefable) {
        if (!Derefable._READER) throw new TypeError("Must provide a builder type");
        return Derefable._deref(this._arena, this._pointer);
    };
    Field.prototype.initAs = function(Initable, optionalLength) {
        if (!Derefable._READER) throw new TypeError("Must provide a builder type");
        return Initable._init(this._arena, this._pointer, optionalLength);
    };
    var Any = function(arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this.__layout = layout;
    };
    Any._READER = Reader;
    Any._TYPE = t;
    Any._FIELD = Field;
    Any._HASH = Reader._HASH;
    Any._deref = function(arena, pointer) {
        return new Any(arena, false, any.safe(arena, pointer));
    };
    Any._set = function(arena, pointer, value) {
        if (value._layout !== undefined) {
            var layout = value._layout();
            if (layout.meta === 1) copy.setListPointer(value._arena, layout, arena, pointer); else copy.setStructPointer(value._arena, layout, arena, pointer);
        } else if (typeof value === "string") Text._set(arena, pointer, value); else if (value instanceof Uint8Array) Data._set(arena, pointer, value); else throw new TypeError();
    };
    Any.prototype = {
        _TYPE: t,
        _layout: Reader.prototype._layout
    };
    return Any;
});