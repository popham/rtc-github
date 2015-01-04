define([ "../../fields" ], function(fields) {
    return function(List) {
        var has = fields.pointer.has();
        List._FIELD.has = function(offset) {
            return function() {
                return has(this, offset);
            };
        };
        List._FIELD.unionHas = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return has(this, offset);
            };
        };
    };
});