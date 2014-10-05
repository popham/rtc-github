define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers'], function(Allocator, builder, reader, scope, readers) { /** Loading `readers` guarantees that reader prototypes have been populated.* Imagine using a builder, `b`:  If the underlying data is shared read-only* by `b.asReader()`, then the prototype of this reader would not have been* initialized unless some external code imported `readers`.*/
    var builders = {};
    var allocator = new Allocator();
    builders.Client = (function() {
        var Structure = scope["0xcd62d4318b3bd10c"];
        Structure.prototype.which = function() {
            return reader.primitives.uint16(this._segment, this._dataSection + 0);
        };
        Structure.prototype._setWhich = function(discriminant) {
            this._maskData(2, 254);
            this._zeroData(4, 4);
            var position = this._dataSection + 0;
            builder.primitives.uint16(discriminant, this._segment, position);
        };
        Structure.prototype.isSignaller = function() {
            return this.which() === 0;
        };
        Structure.SIGNALLER = Structure.prototype.SIGNALLER = 0;
        Structure.Group_signaller = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_signaller);
            Structure.prototype.getInitialSessionId = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.deep(this._defaults.initialSessionId, this._arena, pointer);
                }
                return builder.Data._deref(this._arena, pointer);
            };
            Structure.prototype.setInitialSessionId = function(value) {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                builder.Data._set(this._arena, pointer, value);
            };
            Structure.prototype.hasInitialSessionId = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return (!reader.isNull(pointer));
            };
            Structure.prototype.adoptInitialSessionId = function(value) {
                builder.Data._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 0
                }, value);
            };
            Structure.prototype.disownInitialSessionId = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    return builder.Data._initOrphan(this._arena);
                } else {
                    var instance = builder.Data._deref(this._arena, pointer);
                    this._arena._zero(pointer, 8);
                    instance._isDisowned = true;
                    return instance;
                }
            };
            Structure.prototype._defaults = Structure._READER.prototype._defaults;
            return Structure;
        })(Structure);
        Structure.prototype.getSignaller = function() {
            if (!this.isSignaller()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_signaller(this);
        };
        Structure.prototype.initSignaller = function() {
            this._setWhich(0);
            return new Structure.Group_signaller(this);
        };
        Structure.prototype.isService = function() {
            return this.which() === 1;
        };
        Structure.SERVICE = Structure.prototype.SERVICE = 1;
        Structure.Group_service = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_service);
            Structure.prototype.getOffer = function() {
                var position = this._dataSection + 2;
                return reader.fields.bool(0, this._segment, position, 0);
            };
            Structure.prototype.setOffer = function(value) {
                var position = this._dataSection + 2;
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
            this._setWhich(1);
            return new Structure.Group_service(this);
        };
        Structure.prototype.isPeer = function() {
            return this.which() === 2;
        };
        Structure.PEER = Structure.prototype.PEER = 2;
        Structure.Group_peer = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_peer);
            Structure.prototype.which = function() {
                return reader.primitives.uint16(this._segment, this._dataSection + 2);
            };
            Structure.prototype._setWhich = function(discriminant) {
                this._zeroData(4, 4);
                var position = this._dataSection + 2;
                builder.primitives.uint16(discriminant, this._segment, position);
            };
            Structure.prototype.isOffer = function() {
                return this.which() === 0;
            };
            Structure.OFFER = Structure.prototype.OFFER = 0;
            Structure.Group_offer = (function(Parent) {
                var Structure = builder.group(Parent._READER.Group_offer);
                Structure.prototype.getTarget = function() {
                    var position = this._dataSection + 4;
                    return reader.fields.int32(0, this._segment, position);
                };
                Structure.prototype.setTarget = function(value) {
                    builder.fields.int32(value, 0, this._segment, this._dataSection + 4);
                };
                Structure.prototype._defaults = Structure._READER.prototype._defaults;
                return Structure;
            })(Structure);
            Structure.prototype.getOffer = function() {
                if (!this.isOffer()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                return new Structure.Group_offer(this);
            };
            Structure.prototype.initOffer = function() {
                this._setWhich(0);
                return new Structure.Group_offer(this);
            };
            Structure.prototype.isAnswer = function() {
                return this.which() === 1;
            };
            Structure.ANSWER = Structure.prototype.ANSWER = 1;
            Structure.Group_answer = (function(Parent) {
                var Structure = builder.group(Parent._READER.Group_answer);
                Structure.prototype.getTarget = function() {
                    var position = this._dataSection + 4;
                    return reader.fields.int32(0, this._segment, position);
                };
                Structure.prototype.setTarget = function(value) {
                    builder.fields.int32(value, 0, this._segment, this._dataSection + 4);
                };
                Structure.prototype._defaults = Structure._READER.prototype._defaults;
                return Structure;
            })(Structure);
            Structure.prototype.getAnswer = function() {
                if (!this.isAnswer()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                return new Structure.Group_answer(this);
            };
            Structure.prototype.initAnswer = function() {
                this._setWhich(1);
                return new Structure.Group_answer(this);
            };
            Structure.prototype._defaults = Structure._READER.prototype._defaults;
            return Structure;
        })(Structure);
        Structure.prototype.getPeer = function() {
            if (!this.isPeer()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_peer(this);
        };
        Structure.prototype.initPeer = function() {
            this._setWhich(2);
            return new Structure.Group_peer(this);
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});