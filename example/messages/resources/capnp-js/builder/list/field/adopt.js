define([ "../../fields" ], function(fields) {
    return function(List) {
        var adopt = fields.list.adopt();
        List._FIELD.adopt = function(offset) {
            return function(value) {
                if (!List._TYPE.equiv(value._TYPE)) throw new TypeError();
                if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
                if (!this._arena.isEquivTo(value._arena)) throw new ValueError("Cannot adopt from a different arena");
                adopt(this, offset, value);
            };
        };
        List._FIELD.unionAdopt = function(discr, offset) {
            return function(value) {
                if (!List._TYPE.equiv(value._TYPE)) throw new TypeError();
                if (!value._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
                if (!this._arena.isEquivTo(value._arena)) throw new ValueError("Cannot adopt from a different arena");
                this._setWhich(discr);
                adopt(this, offset, value);
            };
        };
    };
});