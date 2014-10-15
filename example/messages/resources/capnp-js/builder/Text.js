define([ "../reader/Text", "./list/statics", "./list/methods", "./layout/list" ], function(Reader, statics, methods, layout) {
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Text = function(arena, layout, isDisowned) {
        this._arena = arena;
        this._isDisowned = isDisowned;
        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Text._READER = Reader;
    Text._TYPE = t;
    Text._CT = ct;
    Text._decode = Reader._decode;
    // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string#answer-17192845
    Text._encode = function(string) {
        string = unescape(encodeURIComponent(string));
        var uintArray = [];
        for (var i = 0; i < string.length; ++i) {
            uintArray.push(string.charCodeAt(i));
        }
        return new Uint8Array(uintArray);
    };
    statics.install(Text);
    Text._set = function(arena, pointer, value) {
        var source, length;
        if (t === value._TYPE) {
            source = {
                segment: value._segment,
                position: value._begin
            };
            length = value._length - 1;
        } else if (typeof value === "string") {
            source = {
                segment: Text._encode(value),
                position: 0
            };
            length = source.segment.length;
        } else {
            throw new TypeError();
        }
        var blob = arena._preallocate(pointer.segment, length + 1);
        arena._write(source, length, blob);
        layout.preallocated(pointer, blob, ct, length + 1);
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
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    Text.prototype.asString = function() {
        return Reader._decode(this.asBytes());
    };
    return Text;
});