define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants', 'rtc-github-protocol/user.capnp.d/readers'], function(Allocator, reader, scope, constants, file0) {
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
            Structure.USER = Structure.prototype.USER = 1;
            Structure.prototype.isUser = function() {
                return this.which() === 1;
            };
            Structure.prototype.getUser = (function() {
                var Reader = scope["0x95570979dae93deb"];
                return function() {
                    if (!this.isUser()) {
                        throw new Error("Attempted to access an inactive union member");
                    }
                    var pointer = {
                        segment: this._segment,
                        position: this._pointersSection + 0
                    };
                    if (pointer.position < this._end && !reader.isNull(pointer)) {
                        return Reader._deref(this._arena, pointer, this._depth + 1);
                    } else {
                        return this._defaults.user;
                    }
                };
            })();
            Structure.prototype.hasUser = function() {
                if (!this.isUser()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return pointer.position < this._end && !reader.isNull(pointer);
            };
            Structure.prototype._defaults = {
                user: (function() {
                    var Reader = scope["0x95570979dae93deb"];
                    var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                    return Reader._deref(arena, arena._root(), 0);
                })()
            };
            return Structure;
        })();
        Structure.prototype.getSource = function() {
            return new Structure.Group_source(this);
        };
        Structure.prototype.getMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
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
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })()
        };
        return Structure;
    })();
    return readers;
});