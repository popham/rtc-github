define([ "./methods" ], function(methods) {
    return function(Reader) {
        var Group = function(parent) {
            var layout = parent._layout();
            this._arena = parent._arena;
            this._isOrphan = false;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };
        Group._READER = Reader;
        Group.prototype = {
            _rt: methods.rt,
            _layout: methods.layout
        };
        Group.prototype._maskData = function(position, mask) {
            this._segment[this._dataSection + position] &= mask;
        };
        Group.prototype._zeroData = function(position, length) {
            this._arena._zero({
                segment: this._segment,
                position: this._dataSection + position
            }, length);
        };
        return Group;
    };
});