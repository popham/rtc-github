define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.Server = (function() {
        var Structure = scope["0x898617f522cfa2ab"];
        Structure.prototype.getSessionId = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Data._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.sessionId;
            }
        };
        Structure.prototype.getOffers = (function() {
            var Reader = reader.lists.structure(scope['0x95570979dae93deb']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.offers;
                }
            };
        })();
        Structure.prototype.hasOffers = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype._defaults = {
            sessionId: (function() {
                var Reader = reader.Data;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, {
                    segment: arena.getSegment(0),
                    position: 0
                }, 0);
            })(),
            offers: (function() {
                var Reader = reader.lists.structure(scope['0x95570979dae93deb']);
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