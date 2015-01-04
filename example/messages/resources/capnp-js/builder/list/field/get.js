define([ "../../fields" ], function(fields) {
    return function(List) {
        var get = fields.list.get(List);
        List._FIELD.get = function(offset, defaultPosition) {
            return function() {
                return get(defaultPosition, this, offset);
            };
        };
        List._FIELD.unionGet = function(discr, offset, defaultPosition) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                return get(defaultPosition, this, offset);
            };
        };
    };
});