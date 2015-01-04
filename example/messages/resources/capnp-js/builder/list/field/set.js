define([ "../../fields" ], function(fields) {
    return function(List) {
        var set = fields.list.set(List);
        List._FIELD.set = function(offset) {
            return function(value) {
                if (!List._TYPE.equiv(value._TYPE)) throw new TypeError();
                set(this, offset, value);
            };
        };
        List._FIELD.unionSet = function(discr, offset) {
            return function(value) {
                if (!List._TYPE.equiv(value._TYPE)) throw new TypeError();
                this._setWhich(discr);
                set(this, offset, value);
            };
        };
    };
});