define([ "./fields" ], function(fields) {
    return function(Type) {
        var get = fields.pointer.get(Type);
        Type._FIELD.get = function(offset, defaultPosition) {
            return function() {
                return get(defaultPosition, this, offset);
            };
        };
        Type._FIELD.unionGet = function(discr, offset, defaultPosition) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return get(defaultPosition, this, offset);
            };
        };
    };
});