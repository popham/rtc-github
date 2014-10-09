define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', './constants'], function(Allocator, reader, scope, constants) {
    var readers = {};
    var allocator = new Allocator();
    readers.User = (function() {
        var Structure = scope["0x95570979dae93deb"];
        Structure.prototype.getId = function() {
            var position = this._dataSection + 0;
            if (position < this._pointersSection) {
                return reader.fields.int32(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getName = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Text._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.name;
            }
        };
        Structure.prototype._defaults = {
            name: (function() {
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