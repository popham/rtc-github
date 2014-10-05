define([ "text-encoding", "./deref", "./methods" ], function(text, deref, methods) {
    var decoder = new text.TextDecoder("utf-8");
    var Text = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
        arena.limiter.read(list.segment, list.begin, list.length);
    };
    Text._CT = Text.prototype._CT = {
        meta: 1,
        layout: 2,
        dataBytes: 1,
        pointersBytes: 0
    };
    Text._TYPE = Text.prototype._TYPE = {};
    Text._deref = deref(Text);
    Text.prototype.asBytesNull = function() {
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    Text.prototype.asBytes = function() {
        return this._segment.subarray(this._begin, this._begin + this._length - 1);
    };
    Text.prototype.asString = function() {
        return decoder.decode(this.asBytes());
    };
    Text.prototype._rt = methods.rt;
    Text.prototype._layout = methods.layout;
    return Text;
});