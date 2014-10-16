define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers', '../user.capnp.d/builders', '../peer.capnp.d/builders'], function(Allocator, builder, reader, scope, readers, file0, file1) {
    var builders = {};
    var allocator = new Allocator();
    builders.EMPTY_HOSTS_UPDATE = readers.EMPTY_HOSTS_UPDATE;
    builders.Server = (function() {
        var Structure = scope["0x898617f522cfa2ab"];
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
        Structure.prototype.isSession = function() {
            return this.which() === 0;
        };
        Structure.SESSION = Structure.prototype.SESSION = 0;
        Structure.Group_session = (function(Parent) {
            var Structure = builder.group(Parent._READER.Group_session);
            var Builder_user = scope["0x95570979dae93deb"];
            Structure.prototype.initUser = function() {
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
                Builder_user._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 0
                }, value);
            };
            Structure.prototype.disownUser = function() {
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
                return (!reader.isNull(pointer));
            };
            Structure.prototype._defaults = Structure._READER.prototype._defaults;
            return Structure;
        })(Structure);
        Structure.prototype.getSession = function() {
            if (!this.isSession()) {
                throw new Error("Attempted to access an inactive union member");
            }
            return new Structure.Group_session(this);
        };
        Structure.prototype.initSession = function() {
            this._setWhich(0);
            return new Structure.Group_session(this);
        };
        Structure.prototype.isHostsUpdate = function() {
            return this.which() === 1;
        };
        Structure.HOSTS_UPDATE = Structure.prototype.HOSTS_UPDATE = 1;
        var Builder_hostsUpdate = builder.lists.structure(scope["0x95570979dae93deb"]);
        Structure.prototype.initHostsUpdate = function(n) {
            this._setWhich(1);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return Builder_hostsUpdate._init(this._arena, pointer, n);
        };
        Structure.prototype.setHostsUpdate = function(value) {
            if (Builder_hostsUpdate._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            this._setWhich(1);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            Builder_hostsUpdate._set(this._arena, pointer, value);
        };
        Structure.prototype.getHostsUpdate = function() {
            if (!this.isHostsUpdate()) {
                throw new Error("Attempted to access an inactive union member");
            }
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.hostsUpdate, this._arena, pointer);
            }
            return Builder_hostsUpdate._deref(this._arena, pointer);
        };
        Structure.prototype.hasHostsUpdate = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (this.isHostsUpdate() && !reader.isNull(pointer));
        };
        Structure.prototype.isPeer = function() {
            return this.which() === 2;
        };
        Structure.PEER = Structure.prototype.PEER = 2;
        var Builder_peer = scope["0xe5e90b52fd6c402e"];
        Structure.prototype.initPeer = function() {
            this._setWhich(2);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return Builder_peer._init(this._arena, pointer, this._depth + 1);
        };
        Structure.prototype.setPeer = function(value) {
            if (Builder_peer._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            this._setWhich(2);
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
            this._setWhich(2);
            Builder_peer._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownPeer = function() {
            if (!this.isPeer()) {
                throw new Error("Attempted to access an inactive union member");
            }
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