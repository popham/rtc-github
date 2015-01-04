define([ "./fields" ], function(fields) {
    return function(Type) {
        var has = fields.pointer.has();
        Type._FIELD.has = function(offset) {
            return function() {
                return has(this, offset);
            };
        };
        Type._FIELD.unionHas = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return has(this, offset);
            };
        };
    };
});