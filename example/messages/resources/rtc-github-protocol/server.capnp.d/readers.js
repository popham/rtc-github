define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.Server = (function() {
        var Structure = scope["0x898617f522cfa2ab"];
        Structure.prototype.which = function() {
            var position = this._dataSection + 0;
            if (position < this._pointersSection) {
                return reader.primitives.uint16(this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.SESSION = Structure.prototype.SESSION = 0;
        Structure.prototype.isSession = function() {
            return this.which() === 0;
        };
        Structure.Group_session = (function() {
            var Structure = reader.group();
            Structure.prototype.getUser = (function() {
                var Reader = scope["0x95570979dae93deb"];
                return function() {
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
        Structure.prototype.getSession = function() {
            if (!this.isSession()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_session(this);
        };
        Structure.HOSTS_UPDATE = Structure.prototype.HOSTS_UPDATE = 1;
        Structure.prototype.isHostsUpdate = function() {
            return this.which() === 1;
        };
        Structure.prototype.getHostsUpdate = (function() {
            var Reader = reader.lists.structure(scope['0x95570979dae93deb']);
            return function() {
                if (!this.isHostsUpdate()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.hostsUpdate;
                }
            };
        })();
        Structure.prototype.hasHostsUpdate = function() {
            if (!this.isHostsUpdate()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.PEER = Structure.prototype.PEER = 2;
        Structure.prototype.isPeer = function() {
            return this.which() === 2;
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
            hostsUpdate: (function() {
                var Reader = reader.lists.structure(scope['0x95570979dae93deb']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, {
                    segment: arena.getSegment(0),
                    position: 0
                }, 0);
            })(),
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