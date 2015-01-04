define([ "../../../reader/layout/list", "../../layout/list", "../../fields" ], function(reader, list, fields) {
    return function(List) {
        var init = fields.list.init(List);
        List._FIELD.init = function(offset) {
            return function(length) {
                return init(this, offset, length);
            };
        };
        List._FIELD.unionInit = function(discr, offset) {
            return function(length) {
                this._setWhich(discr);
                return init(this, offset, length);
            };
        };
    };
});