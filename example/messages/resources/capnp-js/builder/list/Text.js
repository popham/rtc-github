define([ "../../reader/list/Text", "../../wordAlign", "./deref", "./init", "./methods" ], function(Reader, wordAlign, deref, init, methods) {
    var Text = function(arena, list) {
        this._arena = arena;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Text._CT = Text.prototype._CT = Reader._CT;
    Text._TYPE = Text.prototype._TYPE = Reader._TYPE;
    Text._deref = deref(Text);
    Text._init = init(Text);
    Text.prototype.asBytesNull = Reader.prototype.asBytesNull;
    Text.prototype.asBytes = Reader.prototype.asBytes;
    Text.prototype.asString = Reader.prototype.asString;
    Text.prototype._rt = methods.rt;
    Text.prototype._layout = methods.layout;
    return Text;
});