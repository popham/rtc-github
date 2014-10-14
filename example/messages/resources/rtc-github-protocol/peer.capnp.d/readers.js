define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants', '../user.capnp.d/readers'], function(Allocator, reader, scope, constants, file0) {
    var readers = {};
    var allocator = new Allocator();
    readers.Peer = (function() {
        var Structure = scope["0xe5e90b52fd6c402e"];
        Structure.prototype.which = function() {
            var position = this._dataSection + 8;
            if (position < this._pointersSection) {
                return reader.primitives.uint16(this._segment, position);
            } else {
                return 0;
            }
        };
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
                    return Reader._deref(arena, {
                        segment: arena.getSegment(0),
                        position: 0
                    }, 0);
                })()
            };
            return Structure;
        })();
        Structure.prototype.getSource = function() {
            return new Structure.Group_source(this);
        };
        Structure.Group_target = (function() {
            var Structure = reader.group();
            Structure.prototype.which = function() {
                var position = this._dataSection + 2;
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
        Structure.prototype.getTarget = function() {
            return new Structure.Group_target(this);
        };
        Structure.OFFER = Structure.prototype.OFFER = 0;
        Structure.prototype.isOffer = function() {
            return this.which() === 0;
        };
        Structure.Group_offer = (function() {
            var Structure = reader.group();
            Structure.prototype.getSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return reader.Text._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.sdp;
                }
            };
            Structure.prototype._defaults = {
                sdp: (function() {
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
            Structure.prototype.getSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return reader.Text._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.sdp;
                }
            };
            Structure.prototype._defaults = {
                sdp: (function() {
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
        Structure.prototype.getAnswer = function() {
            if (!this.isAnswer()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_answer(this);
        };
        Structure.ICE_CANDIDATE = Structure.prototype.ICE_CANDIDATE = 2;
        Structure.prototype.isIceCandidate = function() {
            return this.which() === 2;
        };
        Structure.prototype.getIceCandidate = function() {
            if (!this.isIceCandidate()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Text._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.iceCandidate;
            }
        };
        Structure.prototype._defaults = {
            iceCandidate: (function() {
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