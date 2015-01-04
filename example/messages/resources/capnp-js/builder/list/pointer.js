define([ "../../reader/list/meta", "../../type", "../copy/pointer", "../layout/index", "./methods", "./statics" ], function(listMeta, type, copy, layout, methods, statics) {
    return function(Nonstruct) {
        var t = new type.List(Nonstruct._TYPE);
        var ct = {
            meta: 1,
            layout: 6,
            dataBytes: 0,
            pointersBytes: 8
        };
        var Pointers = function(arena, isOrphan, list) {
            this._arena = arena;
            this._isOrphan = isOrphan;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = this._dataBytes + this._pointersBytes;
        };
        Pointers._READER = Nonstruct;
        Pointers._TYPE = t;
        Pointers._CT = ct;
        Pointers._FIELD = {};
        Pointers._HASH = "L|" + Nonstruct._HASH;
        statics.install(Pointers);
        Pointers.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        methods.install(Pointers.prototype);
        Pointers.prototype.get = function(index) {
            return Nonstruct._deref(this._arena, this._pointer(index));
        };
        Pointers.prototype._pointer = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            /* If there exists a data section, then the pointer has been
             * upgraded.  Skip the data section, and the upgraded pointer will
             * be the first element in the pointers section.
             */
            return {
                segment: this._segment,
                position: this._begin + this._dataBytes + index * this._stride
            };
        };
        Pointers.prototype.set = function(index, value) {
            Nonstruct._set(this._arena, this._pointer(index), value);
        };
        Pointers.prototype.init = function(index, length) {
            return Nonstruct._init(this._arena, this._pointer(index), length);
        };
        Pointers.prototype.adopt = function(index, orphan) {
            if (!Nonstruct.equiv(orphan._TYPE)) throw new TypeError();
            if (!orphan._isOrphan) throw new ValueError("Cannot adopt a non-orphan");
            if (!this._arena.isEquivTo(orphan._arena)) throw new ValueError("Cannot adopt from a different arena");
            // AnyPointer to struct => A=0, so handle any pointer type.
            var ell = orphan._layout();
            if (ell.meta === 0) {
                copy.nonpreallocated(this._arena, this._pointer(index), {
                    segment: ell.segment,
                    position: ell.begin
                }, listMeta(ell));
                orphan._isOrphan = false;
            } else if (layout.meta === 1) {
                copy.list.nonpreallocated(this._arena, this._pointer(index), {
                    segment: layout.segment,
                    position: layout.begin
                }, listMeta(layout));
                orphan._isOrphan = false;
            } else {
                throw new ValueError("");
            }
        };
        return Pointers;
    };
});