define([ "../reader/layout/list", "../reader/Text", "./list/field/index", "./copy/pointer", "./list/statics", "./list/methods", "./layout/list", "./fields" ], function(reader, Reader, listField, copy, statics, methods, layout, fields) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Text = function(arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Text._READER = Reader;
    Text._TYPE = t;
    Text._CT = ct;
    Text._FIELD = {};
    Text._HASH = Reader._HASH;
    Text._decode = Reader._decode;
    // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string#answer-17192845
    Text._encode = function(string) {
        string = unescape(encodeURIComponent(string));
        var uintArray = new Uint8Array(string.length);
        for (var i = 0; i < string.length; ++i) {
            uintArray[i] = string.charCodeAt(i);
        }
        return uintArray;
    };
    var stringSet = function(arena, pointer, str) {
        str = Text._encode(str);
        var target = Text._init(arena, pointer, str.length);
        target._segment.set(str, target._begin);
    };
    statics.deref(Text);
    Text._init = function(arena, pointer, length) {
        length = length + 1;
        var blob = arena._preallocate(pointer.segment, length);
        layout.preallocated(pointer, blob, ct, length);
        return new Text(arena, false, reader.unsafe(arena, pointer));
    };
    Text._initOrphan = function(arena, length) {
        length = length + 1;
        var blob = arena._allocate(length);
        return new Text(arena, true, {
            segment: blob.segment,
            begin: blob.position,
            length: length,
            dataBytes: 1,
            pointersBytes: 0
        });
    };
    Text._set = function(arena, pointer, value) {
        if (typeof value === "string") stringSet(arena, pointer, value); else if (value._TYPE.equiv(t)) copy.setListPointer(value._arena, value._layout(), arena, pointer); else throw new TypeError();
    };
    listField.adopt(Text);
    listField.disown(Text);
    listField.get(Text);
    listField.has(Text);
    var init = fields.list.init(Text);
    Text._FIELD.init = function(offset) {
        return function(length) {
            return init(this, offset, length);
        };
    };
    Text._FIELD.unionInit = function(discr, offset) {
        return function(length) {
            this._setWhich(discr);
            return init(this, offset, length);
        };
    };
    var objectSet = fields.list.set(Text);
    Text._FIELD.set = function(offset) {
        return function(value) {
            if (typeof value === "string") {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + offset
                };
                stringSet(this._arena, pointer, value);
            } else if (value._TYPE.equiv(t)) {
                objectSet(this, offset, value);
            } else {
                throw new TypeError();
            }
        };
    };
    Text._FIELD.unionSet = function(discr, offset) {
        return function(value) {
            if (typeof value === "string") {
                this._setWhich(discr);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + offset
                };
                stringSet(this._arena, pointer, value);
            } else if (value._TYPE.equiv(t)) {
                this._setWhich(discr);
                objectSet(this, offset, value);
            } else {
                throw new TypeError();
            }
        };
    };
    Text.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Text.prototype.asBytesNull = function() {
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    Text.prototype.asBytes = function() {
        return this._segment.subarray(this._begin, this._begin + this._length - 1);
    };
    Text.prototype.toString = function() {
        return Reader._decode(this.asBytes());
    };
    return Text;
});