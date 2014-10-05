define([], function() {
    return {
        rt: function() {
            return {
                meta: 0,
                dataBytes: this._pointersSection - this._dataSection,
                pointersBytes: this._end - this._pointersSection
            };
        },
        layout: function() {
            return {
                meta: 0,
                segment: this._segment,
                dataSection: this._dataSection,
                pointersSection: this._pointersSection,
                end: this._end
            };
        }
    };
});