define([ "../../type", "../copy/pointer", "../layout/list", "./deref", "./init", "./methods" ], function(type, copy, list, deref, init, methods) {
    return function(Builder) {
        var t = new type.List(Builder._TYPE);
        var ct = Builder._LIST_CT;
        var Structs = function(arena, list, isDisowned) {
            if (list.dataBytes === null) {
                throw new Error("Single bit structures are not supported");
            }
            this._arena = arena;
            this._isDisowned = isDisowned;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._stride = list.dataBytes + list.pointersBytes;
        };
        Structs._TYPE = t;
        Structs._CT = ct;
        Structs._deref = deref(Structs);
        var stride = Structs._CT.dataBytes + Structs._CT.pointersBytes;
        if (Structs._CT.layout === 7) {
            Structs._init = function(arena, pointer, length) {
                var blob = arena._preallocate(pointer.segment, 8 + length * stride);
                list.preallocated(pointer, blob, Structs._CT, length);
                return Structs._deref(arena, pointer);
            };
        } else if (Structs._CT.layout === 1) {
            throw new Error("Single bit structures are not suported");
        } else {
            Structs._init = init(Structs);
        }
        Structs.prototype = {
            _TYPE: t,
            _CT: ct,
            _rt: methods.rt,
            _layout: methods.layout
        };
        Structs.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            var position = this._begin + index * this._stride;
            var pointers = position + this._dataBytes;
            return new Builder(this._arena, {
                meta: 0,
                segment: this._segment,
                dataSection: position,
                pointersSection: pointers,
                end: pointers + this._pointersBytes
            }, false);
        };
        Structs.prototype.setWithCaveats = function(index, instance) {
            if (Builder._TYPE !== instance._TYPE) {
                throw new TypeError();
            }
            var source = {
                segment: instance._segment,
                position: instance._dataSection
            };
            var target = {
                segment: this._segment,
                position: this._begin + index * this._stride
            };
            this._arena._write(source, this._dataBytes, target);
            var bytes = instance._pointersSection - instance._dataSection;
            var tail = this._dataBytes - bytes;
            if (tail > 0) {
                // Earlier version, so fill excess space with zeros.
                target.position += bytes;
                this.arena._zero(target, tail);
                target.position += tail;
            } else {
                // This or later version.
                target.position += this._dataBytes;
            }
            source.position += bytes;
            bytes = instance._end - instance._pointersSection;
            tail = this._pointersBytes - bytes;
            bytes = Math.min(this._pointersBytes, bytes);
            for (var i = 0; i < bytes; i += 8) {
                copy.any(instance._arena, source, this._arena, target);
                source.position += 8;
                target.position += 8;
            }
            if (tail > 0) {
                // Earlier version, so fill excess space with zeros.
                this.arena._zero(target, tail);
            }
        };
        return Structs;
    };
});