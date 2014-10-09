define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.Client = (function() {
        var Structure = scope["0xcd62d4318b3bd10c"];
        Structure.prototype.which = function() {
            var position = this._dataSection + 2;
            if (position < this._pointersSection) {
                return reader.primitives.uint16(this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.SERVICE = Structure.prototype.SERVICE = 0;
        Structure.prototype.isService = function() {
            return this.which() === 0;
        };
        Structure.Group_service = (function() {
            var Structure = reader.group();
            Structure.prototype.getIsOffering = function() {
                var position = this._dataSection + 0;
                if (position < this._pointersSection) {
                    return reader.fields.bool(0, this._segment, position, 0);
                } else {
                    return !!0;
                }
            };
            Structure.prototype._defaults = {};
            return Structure;
        })();
        Structure.prototype.getService = function() {
            if (!this.isService()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_service(this);
        };
        Structure.PEER = Structure.prototype.PEER = 1;
        Structure.prototype.isPeer = function() {
            return this.which() === 1;
        };
        Structure.prototype.getPeer = (function() {
            var Reader = scope["0xe5e90b52fd6c402e"];
            return function() {
                if (!this.isPeer()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.peer;
                }
            };
        })();
        Structure.prototype.hasPeer = function() {
            if (!this.isPeer()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype._defaults = {
            peer: (function() {
                var Reader = scope["0xe5e90b52fd6c402e"];
                var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                return Reader._deref(arena, {
                    segment: arena.getSegment(0),
                    position: 0
                }, 0);
            })()
        };
        return Structure;
    })();
    return readers;
});