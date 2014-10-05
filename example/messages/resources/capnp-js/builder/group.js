define([ "./methods" ], function(methods) {
    return function(Reader) {
        var Group = function(parent) {
            var layout = parent._layout();
            this._arena = parent._arena;
            this._isDisowned = false;
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
        return Group;
    };
});