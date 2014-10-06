define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers'], function(Allocator, builder, reader, scope, readers) { /** Loading `readers` guarantees that reader prototypes have been populated.* Imagine using a builder, `b`:  If the underlying data is shared read-only* by `b.asReader()`, then the prototype of this reader would not have been* initialized unless some external code imported `readers`.*/
    var builders = {};
    var allocator = new Allocator();
    builders.Client = (function() {
        var Structure = scope["0xd25f3f5837562913"];
        Structure.Group_source = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_source);
            Structure.prototype.which = function() {
                return reader.primitives.uint16(this._segment, this._dataSection + 0);
            };
            Structure.prototype._setWhich = function(discriminant) {
                this._zeroData(4, 4);
                var position = this._dataSection + 0;
                builder.primitives.uint16(discriminant, this._segment, position);
            };
            Structure.prototype.isUnset = function() {
                return this.which() === 0;
            };
            Structure.UNSET = Structure.prototype.UNSET = 0;
            Structure.prototype.getUnset = function() {
                if (!this.isUnset()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                return null;
            };
            Structure.prototype.setUnset = function() {
                this._setWhich(0);
            };
            Structure.prototype.isUserId = function() {
                return this.which() === 1;
            };
            Structure.USER_ID = Structure.prototype.USER_ID = 1;
            Structure.prototype.getUserId = function() {
                if (!this.isUserId()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var position = this._dataSection + 4;
                return reader.fields.int32(0, this._segment, position);
            };
            Structure.prototype.setUserId = function(value) {
                this._setWhich(1);
                builder.fields.int32(value, 0, this._segment, this._dataSection + 4);
            };
            Structure.prototype._defaults = Structure._READER.prototype._defaults;
            return Structure;
        })(Structure);
        Structure.prototype.getSource = function() {
            return new Structure.Group_source(this);
        };
        Structure.prototype.initSource = function() {
            return new Structure.Group_source(this);
        };
        Structure.prototype.getMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.message, this._arena, pointer);
            }
            return builder.Text._deref(this._arena, pointer);
        };
        Structure.prototype.setMessage = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            builder.Text._set(this._arena, pointer, value);
        };
        Structure.prototype.hasMessage = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptMessage = function(value) {
            builder.Text._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownMessage = function() {
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