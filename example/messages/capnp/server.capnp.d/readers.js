define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants', 'rtc-github-protocol/user.capnp.d/readers'], function(Allocator, reader, scope, constants, file0) {
    var readers = {};
    var allocator = new Allocator();
    readers.Server = (function() {
        var Structure = scope["0xaf218e97ba298d14"];
        Structure.Message = (function() {
            var Structure = scope["0xd3e128c467576313"];
            Structure.prototype.getSource = (function() {
                var Reader = scope["0x95570979dae93deb"];
                return function() {
                    var pointer = {
                        segment: this._segment,
                        position: this._pointersSection + 0
                    };
                    if (pointer.position < this._end && !reader.isNull(pointer)) {
                        return Reader._deref(this._arena, pointer, this._depth + 1);
                    } else {
                        return this._defaults.source;
                    }
                };
            })();
            Structure.prototype.hasSource = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return pointer.position < this._end && !reader.isNull(pointer);
            };
            Structure.prototype.getValue = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return reader.Text._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.value;
                }
            };
            Structure.prototype._defaults = {
                source: (function() {
                    var Reader = scope["0x95570979dae93deb"];
                    var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                    return Reader._deref(arena, {
                        segment: arena.getSegment(0),
                        position: 0
                    }, 0);
                })(),
                value: (function() {
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
        Structure.prototype.getMessages = (function() {
            var Reader = reader.lists.structure(scope['0xd3e128c467576313']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.messages;
                }
            };
        })();
        Structure.prototype.hasMessages = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype._defaults = {
            messages: (function() {
                var Reader = reader.lists.structure(scope['0xd3e128c467576313']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
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