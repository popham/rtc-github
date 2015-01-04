define(['capnp-js/builder/Allocator', 'capnp-js/reader/index', './rScope', 'rtc-github-protocol/user.capnp.d/readers'], function(Allocator, reader, scope) {
    var readers = {};
    var allocator = new Allocator();
    (function(types, parentScope, allocator) {
        var Structure = types["0xaf218e97ba298d14"];
        Structure._PARENT = parentScope;
        (function(types, parentScope, allocator) {
            var Structure = types["0xd3e128c467576313"];
            Structure._PARENT = parentScope;
            Structure.prototype._pointerDefaults = [];
            (function(types, parentScope, allocator) {
                var defaults = parentScope.prototype._pointerDefaults; /* source */
                var f0 = types["0x95570979dae93deb"]._FIELD;
                parentScope.prototype.getSource = f0.get(0, 0);
                parentScope.prototype.hasSource = f0.has(0); /* value */
                var f1 = reader.Text._FIELD;
                parentScope.prototype.getValue = f1.get(8, 1);
                parentScope.prototype.hasValue = f1.has(8);
                defaults[0] = (function() {
                    var Reader = types["0x95570979dae93deb"];
                    var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                    return Reader._deref(arena, arena._root(), 0);
                })();
                defaults[1] = (function() {
                    var Reader = reader.Text;
                    var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                    return Reader._deref(arena, arena._root(), 0);
                })();
                parentScope.prototype._floatDefaults = {};
            })(types, Structure, allocator);
            parentScope.Message = Structure;
        })(types, Structure, allocator);
        Structure.prototype._pointerDefaults = [];
        (function(types, parentScope, allocator) {
            var defaults = parentScope.prototype._pointerDefaults; /* messages */
            var f0 = reader.lists.struct(types["0xd3e128c467576313"])._FIELD;
            parentScope.prototype.getMessages = f0.get(0, 0);
            parentScope.prototype.hasMessages = f0.has(0);
            defaults[0] = (function() {
                var Reader = reader.lists.struct(types["0xd3e128c467576313"]);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })();
            parentScope.prototype._floatDefaults = {};
        })(types, Structure, allocator);
        parentScope.Server = Structure;
    })(scope, readers, allocator);
    return readers;
});