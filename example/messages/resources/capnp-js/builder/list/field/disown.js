define([ "../../../reader/isNull", "../../fields" ], function(isNull, fields) {
    return function(List) {
        var disown = fields.pointer.disown(List);
        var disownReader = fields.pointer.disownReader(List._READER);
        List._FIELD.disown = function(offset) {
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + offset
                };
                if (isNull(pointer)) throw new ValueError("Cannot disown a null list pointer");
                return disown(this, offset);
            };
        };
        List._FIELD.unionDisown = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + offset
                };
                if (isNull(pointer)) throw new ValueError("Cannot disown a null list pointer");
                return disown(this, offset);
            };
        };
        List._FIELD.disownReader = function(offset) {
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + offset
                };
                if (isNull(pointer)) throw new ValueError("Cannot disown a null list pointer");
                return disownReader(this, offset);
            };
        };
        List._FIELD.unionDisownReader = function(discr, offset) {
            return function() {
                fields.throwOnInactive(this.which(), discr);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + offset
                };
                if (isNull(pointer)) throw new ValueError("Cannot disown a null list pointer");
                return disownReader(this, offset);
            };
        };
    };
});