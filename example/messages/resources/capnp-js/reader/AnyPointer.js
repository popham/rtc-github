define([ "../type", "./layout/any", "./isNull", "./fields" ], function(type, any, isNull, fields) {
    var t = new type.Terminal();
    var Field = function(discr, parent, pointer) {
        this._arena = parent._arena;
        this._isOrphan = false;
        this._discr = discr;
        this._parent = parent;
        this._pointer = pointer;
    };
    Field._TYPE = t;
    Field._HASH = "A";
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
    Field.prototype = {
        _TYPE: t,
        _layout: function() {
            return any.safe(this._arena, this._pointer);
        }
    };
    Field.prototype.getAs = function(Derefable) {
        if (Derefable._READER) {
            console.warn("Cannot cast a reader's AnyPointer to a builder");
            Derefable = Derefable._READER;
        }
        if (isNull(this._pointer) && Derefable._CT.meta === 1) throw new ValueError("Cannot cast a null pointer to a list type");
        return Derefable._deref(this._arena, this._pointer, this._parent._depth + 1);
    };
    var Any = function(arena, depth, isOrphan, layout) {
        this._arena = arena;
        this._depth = depth;
        this._isOrphan = isOrphan;
        this.__layout = layout;
        if (layout.meta === 0) {
            this._arena.limiter.read(layout.segment, layout.dataSection, layout.end - layout.dataSection);
        } else {
            this._arena.limiter.read(layout.segment, layout.begin, layout.length);
        }
    };
    Any._TYPE = t;
    Any._FIELD = Field;
    Any._deref = function(arena, pointer, depth) {
        return new Any(arena, depth, false, any.safe(arena, pointer));
    };
    Any.prototype = {
        _TYPE: t,
        _layout: function() {
            return this.__layout;
        }
    };
    return Any;
});