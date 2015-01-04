define(['capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers', 'rtc-github-protocol/user.capnp.d/builders'], function(builder, reader, scope, readers, file0) {
    var builders = {
        _READER: readers
    };
    (function(types, parentScope) {
        var Structure = types["0xd25f3f5837562913"];
        Structure._PARENT = parentScope;
        Structure.prototype._pointerDefaults = Structure._READER.prototype._pointerDefaults;
        (function(types, parentScope) {
            parentScope.prototype._pointerDefaults = parentScope._READER.prototype._pointerDefaults;
            parentScope.prototype._floatDefaults = parentScope._READER.prototype._floatDefaults;
            var G0 = builder.group(parentScope._READER.source);
            parentScope.source = G0;
            G0.prototype._pointerDefaults = parentScope.prototype._pointerDefaults;
            (function(types, parentScope) {
                parentScope.prototype._pointerDefaults = parentScope._READER.prototype._pointerDefaults;
                parentScope.prototype._floatDefaults = parentScope._READER.prototype._floatDefaults;
                parentScope.prototype.which = function() {
                    return reader.primitives.uint16(this._segment, this._dataSection + 0);
                };
                parentScope.prototype._setWhich = function(discr) {
                    builder.zero.pointer(this._arena, {
                        segment: this._segment,
                        position: this._pointersSection + 0
                    });
                    var position = this._dataSection + 0;
                    builder.primitives.uint16(discr, this._segment, position);
                };
                parentScope.prototype.isUnset = function() {
                    return this.which() === 0;
                };
                parentScope.UNSET = parentScope.prototype.UNSET = 0;
                parentScope.prototype.getUnset = function() {
                    if (!this.isUnset()) {
                        throw new Error("Attempted to access an inactive union member");
                    }
                    return null;
                };
                parentScope.prototype.setUnset = function() {
                    this._setWhich(0);
                };
                parentScope.prototype.isUser = function() {
                    return this.which() === 1;
                };
                parentScope.USER = parentScope.prototype.USER = 1;
                var f1 = types["0x95570979dae93deb"]._FIELD;
                parentScope.prototype.adoptUser = f1.unionAdopt(1, 0);
                parentScope.prototype.getUser = f1.unionGet(1, 0, 0);
                parentScope.prototype.hasUser = f1.unionHas(1, 0);
                parentScope.prototype.initUser = f1.unionInit(1, 0);
                parentScope.prototype.disownUser = f1.unionDisown(1, 0);
                parentScope.prototype.disownReadOnlyUser = f1.unionDisownReader(1, 0);
                parentScope.prototype.setUser = f1.unionSet(1, 0);
            })(types, G0);
            parentScope.prototype.getSource = function() {
                return new G0(this);
            };
            parentScope.prototype.initSource = function() {
                return new G0(this);
            };
            var f1 = builder.Text._FIELD;
            parentScope.prototype.adoptMessage = f1.adopt(8);
            parentScope.prototype.getMessage = f1.get(8, 1);
            parentScope.prototype.hasMessage = f1.has(8);
            parentScope.prototype.initMessage = f1.init(8);
            parentScope.prototype.disownMessage = f1.disown(8);
            parentScope.prototype.disownReadOnlyMessage = f1.disownReader(8);
            parentScope.prototype.setMessage = f1.set(8);
        })(types, Structure);
        parentScope.Client = Structure;
    })(scope, builders);
    return builders;
});