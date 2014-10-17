define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers', '../user.capnp.d/builders'], function(Allocator, builder, reader, scope, readers, file0) {
    var builders = {};
    var allocator = new Allocator();
    builders.MediaIdentifier = readers.MediaIdentifier;
    builders.Peer = (function() {
        var Structure = scope["0xe5e90b52fd6c402e"];
        Structure.Ice = (function() {
            var Structure = scope["0xf2ae185395b2f8ef"];
            Structure.prototype.getCandidate = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.deep(this._defaults.candidate, this._arena, pointer);
                }
                return builder.Text._deref(this._arena, pointer);
            };
            Structure.prototype.setCandidate = function(value) {
                var params = builder.Text._setParams(value);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                builder.Text._set(this._arena, pointer, params);
            };
            Structure.prototype.hasCandidate = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return (!reader.isNull(pointer));
            };
            Structure.prototype.adoptCandidate = function(value) {
                if (builder.Text._TYPE !== value._TYPE) {
                    throw new TypeError();
                }
                builder.Text._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 0
                }, value);
            };
            Structure.prototype.disownCandidate = function() {
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
            Structure.prototype.getSdpMLineIndex = function() {
                var position = this._dataSection + 0;
                return reader.fields.uint16(0, this._segment, position);
            };
            Structure.prototype.setSdpMLineIndex = function(value) {
                builder.fields.uint16(value, 0, this._segment, this._dataSection + 0);
            };
            Structure.prototype.getSdpMId = function() {
                var position = this._dataSection + 2;
                return reader.fields.uint16(0, this._segment, position);
            };
            Structure.prototype.setSdpMId = function(value) {
                builder.fields.uint16(value, 0, this._segment, this._dataSection + 2);
            };
            Structure.prototype._defaults = Structure._READER.prototype._defaults;
            return Structure;
        })();
        Structure.prototype.which = function() {
            return reader.primitives.uint16(this._segment, this._dataSection + 8);
        };
        Structure.prototype._setWhich = function(discriminant) {
            builder.zero.pointer(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 8
            });
            var position = this._dataSection + 8;
            builder.primitives.uint16(discriminant, this._segment, position);
        };
        Structure.Group_source = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_source);
            Structure.prototype.which = function() {
                return reader.primitives.uint16(this._segment, this._dataSection + 0);
            };
            Structure.prototype._setWhich = function(discriminant) {
                builder.zero.pointer(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 0
                });
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
            Structure.prototype.isUser = function() {
                return this.which() === 1;
            };
            Structure.USER = Structure.prototype.USER = 1;
            var Builder_user = scope["0x95570979dae93deb"];
            Structure.prototype.initUser = function() {
                this._setWhich(1);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return Builder_user._init(this._arena, pointer, this._depth + 1);
            };
            Structure.prototype.setUser = function(value) {
                if (Builder_user._TYPE !== value._TYPE) {
                    throw new TypeError();
                }
                this._setWhich(1);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                Builder_user._set(this._arena, pointer, value);
            };
            Structure.prototype.adoptUser = function(value) {
                if (Builder_user._TYPE !== value._TYPE) {
                    throw new TypeError();
                }
                this._setWhich(1);
                Builder_user._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 0
                }, value);
            };
            Structure.prototype.disownUser = function() {
                if (!this.isUser()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    return Builder_user._initOrphan(this._arena);
                } else {
                    var instance = Builder_user._deref(this._arena, pointer);
                    this._arena._zero(pointer, 8);
                    instance._isDisowned = true;
                    return instance;
                }
            };
            Structure.prototype.getUser = function() {
                if (!this.isUser()) {
                    throw new Error("Attempted to access an inactive union member");
                }
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.deep(this._defaults.user, this._arena, pointer);
                }
                return Builder_user._deref(this._arena, pointer);
            };
            Structure.prototype.hasUser = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return (this.isUser() && !reader.isNull(pointer));
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
        Structure.Group_target = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_target);
            Structure.prototype.which = function() {
                return reader.primitives.uint16(this._segment, this._dataSection + 2);
            };
            Structure.prototype._setWhich = function(discriminant) {
                this._zeroData(4, 4);
                var position = this._dataSection + 2;
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
        Structure.prototype.getTarget = function() {
            return new Structure.Group_target(this);
        };
        Structure.prototype.initTarget = function() {
            return new Structure.Group_target(this);
        };
        Structure.prototype.isOffer = function() {
            return this.which() === 0;
        };
        Structure.OFFER = Structure.prototype.OFFER = 0;
        Structure.Group_offer = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_offer);
            Structure.prototype.getSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.deep(this._defaults.sdp, this._arena, pointer);
                }
                return builder.Text._deref(this._arena, pointer);
            };
            Structure.prototype.setSdp = function(value) {
                var params = builder.Text._setParams(value);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                builder.Text._set(this._arena, pointer, params);
            };
            Structure.prototype.hasSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                return (!reader.isNull(pointer));
            };
            Structure.prototype.adoptSdp = function(value) {
                if (builder.Text._TYPE !== value._TYPE) {
                    throw new TypeError();
                }
                builder.Text._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 8
                }, value);
            };
            Structure.prototype.disownSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
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
            Structure.prototype.getSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.deep(this._defaults.sdp, this._arena, pointer);
                }
                return builder.Text._deref(this._arena, pointer);
            };
            Structure.prototype.setSdp = function(value) {
                var params = builder.Text._setParams(value);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                builder.Text._set(this._arena, pointer, params);
            };
            Structure.prototype.hasSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                return (!reader.isNull(pointer));
            };
            Structure.prototype.adoptSdp = function(value) {
                if (builder.Text._TYPE !== value._TYPE) {
                    throw new TypeError();
                }
                builder.Text._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 8
                }, value);
            };
            Structure.prototype.disownSdp = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
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
        Structure.prototype.isIce = function() {
            return this.which() === 2;
        };
        Structure.ICE = Structure.prototype.ICE = 2;
        var Builder_ice = scope["0xf2ae185395b2f8ef"];
        Structure.prototype.initIce = function() {
            this._setWhich(2);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return Builder_ice._init(this._arena, pointer, this._depth + 1);
        };
        Structure.prototype.setIce = function(value) {
            if (Builder_ice._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            this._setWhich(2);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            Builder_ice._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptIce = function(value) {
            if (Builder_ice._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            this._setWhich(2);
            Builder_ice._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 8
            }, value);
        };
        Structure.prototype.disownIce = function() {
            if (!this.isIce()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                return Builder_ice._initOrphan(this._arena);
            } else {
                var instance = Builder_ice._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        Structure.prototype.getIce = function() {
            if (!this.isIce()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.ice, this._arena, pointer);
            }
            return Builder_ice._deref(this._arena, pointer);
        };
        Structure.prototype.hasIce = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return (this.isIce() && !reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});