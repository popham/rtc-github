define([ "./sizes" ], function(sizes) {
    var length = function() {
        return this._length;
    };
    var map = function(fn) {
        var arr = [];
        for (var i = 0; i < this._length; ++i) {
            arr.push(fn(this.get(i), i, this));
        }
        return arr;
    };
    var forEach = function(fn) {
        for (var i = 0; i < this._length; ++i) {
            fn(this.get(i), i, this);
        }
    };
    var reduce = function(fn, acc) {
        var i = 0;
        if (acc === undefined) {
            if (this._length === 0) {
                throw new TypeError();
            }
            acc = this.get(0);
            i = 1;
        }
        for (;i < this._length; ++i) {
            acc = fn(acc, this.get(i), i, this);
        }
        return acc;
    };
    var rt = function() {
        var layout;
        if (this._dataBytes === null) {
            layout = 1;
        } else if (this._dataBytes + this._pointersBytes > 8) {
            layout = 7;
        } else {
            layout = sizes[this._dataBytes][this._pointersBytes];
        }
        return {
            meta: 1,
            layout: layout,
            dataBytes: this._dataBytes,
            pointersBytes: this._pointersBytes
        };
    };
    var layout = function() {
        return {
            meta: 1,
            segment: this._segment,
            begin: this._begin,
            length: this._length,
            dataBytes: this._dataBytes,
            pointersBytes: this._pointersBytes
        };
    };
    var install = function(target) {
        target.length = length;
        target.map = map;
        target.forEach = forEach;
        target.reduce = reduce;
    };
    return {
        length: length,
        map: map,
        forEach: forEach,
        reduce: reduce,
        rt: rt,
        layout: layout,
        install: install
    };
});