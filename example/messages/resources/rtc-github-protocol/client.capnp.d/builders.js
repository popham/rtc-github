define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers', '../peer.capnp.d/builders'], function(Allocator, builder, reader, scope, readers, file0) {
    var builders = {};
    var allocator = new Allocator();
    builders.Client = (function() {
        var Structure = scope["0xcd62d4318b3bd10c"];
        Structure.prototype.which = function() {
            return reader.primitives.uint16(this._segment, this._dataSection + 2);
        };
        Structure.prototype._setWhich = function(discriminant) {
            this._maskData(0, 254);
            builder.zero.pointer(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            });
            var position = this._dataSection + 2;
            builder.primitives.uint16(discriminant, this._segment, position);
        };
        Structure.prototype.isService = function() {
            return this.which() === 0;
        };
        Structure.SERVICE = Structure.prototype.SERVICE = 0;
        Structure.Group_service = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_service);
            Structure.prototype.getIsOffering = function() {
                var position = this._dataSection + 0;
                return reader.fields.bool(0, this._segment, position, 0);
            };
            Structure.prototype.setIsOffering = function(value) {
                var position = this._dataSection + 0;
                builder.fields.bool(value, 0, this._segment, position, 0);
            };
            Structure.prototype._defaults = Structure._READER.prototype._defaults;
            return Structure;
        })(Structure);
        Structure.prototype.getService = function() {
            if (!this.isService()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_service(this);
        };
        Structure.prototype.initService = function() {
            this._setWhich(0);
            return new Structure.Group_service(this);
        };
        Structure.prototype.isPeer = function() {
            return this.which() === 1;
        };
        Structure.PEER = Structure.prototype.PEER = 1;
        var Builder_peer = scope["0xe5e90b52fd6c402e"];
        Structure.prototype.initPeer = function() {
            this._setWhich(1);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return Builder_peer._init(this._arena, pointer, this._depth + 1);
        };
        Structure.prototype.setPeer = function(value) {
            this._setWhich(1);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            Builder_peer._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptPeer = function(value) {
            if (Builder_peer._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            Builder_peer._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownPeer = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                return Builder_peer._initOrphan(this._arena);
            } else {
                var instance = Builder_peer._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        Structure.prototype.getPeer = function() {
            if (!this.isPeer()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.peer, this._arena, pointer);
            }
            return Builder_peer._deref(this._arena, pointer);
        };
        Structure.prototype.hasPeer = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (this.isPeer() && !reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});