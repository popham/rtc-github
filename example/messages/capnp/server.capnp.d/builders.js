define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers'], function(Allocator, builder, reader, scope, readers) { /** Loading `readers` guarantees that reader prototypes have been populated.* Imagine using a builder, `b`:  If the underlying data is shared read-only* by `b.asReader()`, then the prototype of this reader would not have been* initialized unless some external code imported `readers`.*/
    var builders = {};
    var allocator = new Allocator();
    builders.Server = (function() {
        var Structure = scope["0xaf218e97ba298d14"];
        var Builder_message = builder.lists.Text;
        Structure.prototype.initMessage = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return Builder_message._init(this._arena, pointer, n);
        };
        Structure.prototype.setMessage = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            Builder_message._set(this._arena, pointer, value);
        };
        Structure.prototype.getMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.message, this._arena, pointer);
            }
            return Builder_message._deref(this._arena, pointer);
        };
        Structure.prototype.hasMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});