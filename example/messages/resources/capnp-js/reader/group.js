define([ "./methods" ], function(methods) {
    return function(parentScope) {
        var Group = function(parent) {
            var layout = parent._layout();
            this._arena = parent._arena;
            this._depth = parent._depth;
            this._isOrphan = false;
            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };
        Group._PARENT = parentScope;
        Group.prototype = {
            _PARENT: parentScope,
            _rt: methods.rt,
            _layout: methods.layout
        };
        return Group;
    };
});