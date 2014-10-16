define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers'], function(Allocator, builder, reader, scope, readers) {
    var builders = {};
    var allocator = new Allocator();
    builders.User = (function() {
        var Structure = scope["0x95570979dae93deb"];
        Structure.prototype.getId = function() {
            var position = this._dataSection + 0;
            return reader.fields.int32(0, this._segment, position);
        };
        Structure.prototype.setId = function(value) {
            builder.fields.int32(value, 0, this._segment, this._dataSection + 0);
        };
        Structure.prototype.getName = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.name, this._arena, pointer);
            }
            return builder.Text._deref(this._arena, pointer);
        };
        Structure.prototype.setName = function(value) {
            if (builder.Text._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            builder.Text._set(this._arena, pointer, value);
        };
        Structure.prototype.hasName = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptName = function(value) {
            if (builder.Text._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            builder.Text._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownName = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                return builder.Text._initOrphan(this._arena);
            } else {
                var instance = builder.Text._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});