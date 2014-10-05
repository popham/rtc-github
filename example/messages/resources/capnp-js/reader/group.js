define([ "./methods" ], function(methods) {
    return function() {
        var Group = function(parent) {
            var layout = parent._layout();
            this._arena = parent._arena;
            this._depth = parent._depth;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };
        Group.prototype = {
            _rt: methods.rt,
            _layout: methods.layout
        };
        return Group;
    };
});