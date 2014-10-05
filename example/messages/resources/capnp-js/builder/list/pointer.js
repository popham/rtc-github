define([ "../../type", "./methods", "./statics" ], function(type, methods, statics) {
    return function(Nonstruct) {
        var t = new type.List(Nonstruct._TYPE);
        var ct = {
            meta: 1,
            layout: 6,
            dataBytes: 0,
            pointersBytes: 8
        };
        var Pointers = function(arena, list, isDisowned) {
            this._arena = arena;
            this._isDisowned = isDisowned;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = this._dataBytes + this._pointersBytes;
        };
        Pointers._TYPE = t;
        Pointers._CT = ct;
        statics.install(Pointers);
        Pointers.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Pointers.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return Nonstruct._deref(this._arena, {
                segment: this._segment,
                position: this._begin + this._dataBytes + index * this._stride
            });
        };
        Pointers.prototype._pointer = function(index) {
            return {
                segment: this._segment,
                position: this._begin + index * this._stride
            };
        };
        Pointers.prototype.set = function(index, value) {
            Nonstruct._set(this._arena, this._pointer(index), value);
        };
        Pointers.prototype.adopt = function(index, orphan) {
            Nonstruct._adopt(this._arena, this._pointer(index), orphan);
        };
        return Pointers;
    };
});