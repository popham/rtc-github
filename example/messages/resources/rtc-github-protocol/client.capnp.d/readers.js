define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.Client = (function() {
        var Structure = scope["0xcd62d4318b3bd10c"];
        Structure.prototype.which = function() {
            var position = this._dataSection + 0;
            if (position < this._pointersSection) {
                return reader.primitives.uint16(this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.SIGNALLER = Structure.prototype.SIGNALLER = 0;
        Structure.prototype.isSignaller = function() {
            return this.which() === 0;
        };
        Structure.Group_signaller = (function() {
            var Structure = reader.group();
            Structure.prototype.getInitialSessionId = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return reader.Data._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.initialSessionId;
                }
            };
            Structure.prototype._defaults = {
                initialSessionId: (function() {
                    var Reader = reader.Data;
                    var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                    return Reader._deref(arena, {
                        segment: arena.getSegment(0),
                        position: 0
                    }, 0);
                })()
            };
            return Structure;
        })();
        Structure.prototype.getSignaller = function() {
            if (!this.isSignaller()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_signaller(this);
        };
        Structure.SERVICE = Structure.prototype.SERVICE = 1;
        Structure.prototype.isService = function() {
            return this.which() === 1;
        };
        Structure.Group_service = (function() {
            var Structure = reader.group();
            Structure.prototype.getOffer = function() {
                var position = this._dataSection + 2;
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
        Structure.PEER = Structure.prototype.PEER = 2;
        Structure.prototype.isPeer = function() {
            return this.which() === 2;
        };
        Structure.Group_peer = (function() {
            var Structure = reader.group();
            Structure.prototype.which = function() {
                var position = this._dataSection + 2;
                if (position < this._pointersSection) {
                    return reader.primitives.uint16(this._segment, position);
                } else {
                    return 0;
                }
            };
            Structure.OFFER = Structure.prototype.OFFER = 0;
            Structure.prototype.isOffer = function() {
                return this.which() === 0;
            };
            Structure.Group_offer = (function() {
                var Structure = reader.group();
                Structure.prototype.getTarget = function() {
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
            Structure.prototype.getOffer = function() {
                if (!this.isOffer()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                return new Structure.Group_offer(this);
            };
            Structure.ANSWER = Structure.prototype.ANSWER = 1;
            Structure.prototype.isAnswer = function() {
                return this.which() === 1;
            };
            Structure.Group_answer = (function() {
                var Structure = reader.group();
                Structure.prototype.getTarget = function() {
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
            Structure.prototype.getAnswer = function() {
                if (!this.isAnswer()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                return new Structure.Group_answer(this);
            };
            Structure.prototype._defaults = {};
            return Structure;
        })();
        Structure.prototype.getPeer = function() {
            if (!this.isPeer()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_peer(this);
        };
        Structure.prototype._defaults = {};
        return Structure;
    })();
    return readers;
});