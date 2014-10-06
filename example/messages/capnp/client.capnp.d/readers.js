define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.Client = (function() {
        var Structure = scope["0xd25f3f5837562913"];
        Structure.Group_source = (function() {
            var Structure = reader.group();
            Structure.prototype.which = function() {
                var position = this._dataSection + 0;
                if (position < this._pointersSection) {
                    return reader.primitives.uint16(this._segment, position);
                } else {
                    return 0;
                }
            };
            Structure.UNSET = Structure.prototype.UNSET = 0;
            Structure.prototype.isUnset = function() {
                return this.which() === 0;
            };
            Structure.prototype.getUnset = function() {
                if (!this.isUnset()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                return null;
            };
            Structure.USER_ID = Structure.prototype.USER_ID = 1;
            Structure.prototype.isUserId = function() {
                return this.which() === 1;
            };
            Structure.prototype.getUserId = function() {
                if (!this.isUserId()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var position = this._dataSection + 4;
                if (position < this._pointersSection) {
                    return reader.fields.int32(0, this._segment, position);
                } else {
                    return 0;
                }
            };
            Structure.prototype._defaults = {};
            return Structure;
        })();
        Structure.prototype.getSource = function() {
            return new Structure.Group_source(this);
        };
        Structure.prototype.getMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Text._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.message;
            }
        };
        Structure.prototype._defaults = {
            message: (function() {
                var Reader = reader.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
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