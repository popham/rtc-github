define([ "../type", "./list/deref", "./list/methods" ], function(type, deref, methods) {
    var t = new type.Terminal();
    var ct = {
        meta: 1,
        layout: 2,
        dataBytes: 1,
        pointersBytes: 0
    };
    var Text = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
        this._arena.limiter.read(list.segment, list.begin, list.length);
    };
    Text._TYPE = t;
    Text._CT = ct;
    Text._deref = deref(Text);
    // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string#answer-17192845
    Text._decode = function(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray);
        return decodeURIComponent(escape(encodedString));
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
    Text.prototype.asString = function() {
        return Text._decode(this.asBytes());
    };
    return Text;
});