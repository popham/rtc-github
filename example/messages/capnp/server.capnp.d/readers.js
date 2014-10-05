define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.Server = (function() {
        var Structure = scope["0xaf218e97ba298d14"];
        Structure.prototype.getMessage = (function() {
            var Reader = reader.lists.Text;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.message;
                }
            };
        })();
        Structure.prototype.hasMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype._defaults = {
            message: (function() {
                var Reader = reader.lists.Text;
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