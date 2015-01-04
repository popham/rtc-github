define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', 'rtc-github-protocol/user.capnp.d/readers'], function(Allocator, reader, scope) {
    var readers = {};
    var allocator = new Allocator();
    (function(types, parentScope, allocator) {
        var Structure = types["0xd25f3f5837562913"];
        Structure._PARENT = parentScope;
        Structure.prototype._pointerDefaults = [];
        (function(types, parentScope, allocator) {
            var defaults = parentScope.prototype._pointerDefaults; /* source */
            var G0 = reader.group(parentScope);
            parentScope.source = G0;
            G0.prototype._pointerDefaults = defaults;
            (function(types, parentScope, allocator) {
                parentScope.prototype.which = function() {
                    var position = this._dataSection + 0;
                    if (position < this._pointersSection) {
                        return reader.primitives.uint16(this._segment, position);
                    } else {
                        return 0;
                    }
                };
                var defaults = parentScope.prototype._pointerDefaults; /* unset */
                parentScope.prototype.isUnset = function() {
                    return this.which() === 0;
                };
                parentScope.UNSET = parentScope.prototype.UNSET = 0;
                parentScope.prototype.getUnset = function() {
                    if (!this.isUnset()) {
                        throw new Error("Attempted to access an inactive union member");
                    }
                    return null;
                }; /* user */
                parentScope.prototype.isUser = function() {
                    return this.which() === 1;
                };
                parentScope.USER = parentScope.prototype.USER = 1;
                var f1 = types["0x95570979dae93deb"]._FIELD;
                parentScope.prototype.getUser = f1.unionGet(1, 0, 0);
                parentScope.prototype.hasUser = f1.unionHas(1, 0);
                defaults[0] = (function() {
                    var Reader = types["0x95570979dae93deb"];
                    var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                    return Reader._deref(arena, arena._root(), 0);
                })();
                parentScope.prototype._floatDefaults = {};
            })(types, G0, allocator);
            parentScope.prototype.getSource = function() {
                return new G0(this);
            }; /* message */
            var f1 = reader.Text._FIELD;
            parentScope.prototype.getMessage = f1.get(8, 1);
            parentScope.prototype.hasMessage = f1.has(8);
            defaults[1] = (function() {
                var Reader = reader.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })();
            parentScope.prototype._floatDefaults = {};
        })(types, Structure, allocator);
        parentScope.Client = Structure;
    })(scope, readers, allocator);
    return readers;
});