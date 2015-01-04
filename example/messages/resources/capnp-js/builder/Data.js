define([ "../reader/Data", "./list/field/index", "./list/statics", "./list/methods", "./layout/list", "./fields" ], function(Reader, listField, statics, methods, layout, fields) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Data = function(arena, isOrphan, listLayout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this._segment = listLayout.segment;
        this._begin = listLayout.begin;
        this._length = listLayout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Data._READER = Reader;
    Data._TYPE = t;
    Data._CT = ct;
    Data._FIELD = {};
    Data._HASH = Reader._HASH;
    statics.deref(Data);
    statics.init(Data);
    statics.initOrphan(Data);
    var rawSet = function(arena, pointer, raw) {
        var target = Data._init(arena, pointer, raw.length);
        target._segment.set(raw, target._begin);
    };
    Data._set = function(arena, pointer, value) {
        if (value instanceof Uint8Array) rawSet(arena, pointer, value); else if (value._TYPE.equiv(t)) copy.setListPointer(value._arena, value._layout(), arena, pointer); else throw new TypeError();
    };
    listField.adopt(Data);
    listField.disown(Data);
    listField.get(Data);
    listField.has(Data);
    listField.init(Data);
    var objectSet = fields.list.set(Data);
    Data._FIELD.set = function(offset) {
        return function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + offset
            };
            if (value instanceof Uint8Array) rawSet(this._arena, pointer, value); else if (value._TYPE.equiv(t)) objectSet(this, offset, value); else throw new TypeError();
        };
    };
    Data._FIELD.unionSet = function(discr, offset) {
        return function(value) {
            var setter;
            if (value instanceof Uint8Array) setter = rawSet; else if (value._TYPE.equiv(t)) setter = objectSet; else throw new TypeError();
            this._setWhich(discr);
            setter(this, offset, value);
        };
    };
    Data.prototype = {
        _CT: ct,
        _TYPE: t,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Data.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        return this._segment[this._begin + index];
    };
    Data.prototype.raw = function() {
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    methods.install(Data.prototype);
    return Data;
});