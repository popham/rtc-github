define(['capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers', 'rtc-github-protocol/user.capnp.d/builders'], function(builder, reader, scope, readers, file0) {
    var builders = {
        _READER: readers
    };
    (function(types, parentScope) {
        var Structure = types["0xaf218e97ba298d14"];
        Structure._PARENT = parentScope;
        (function(types, parentScope) {
            var Structure = types["0xd3e128c467576313"];
            Structure._PARENT = parentScope;
            Structure.prototype._pointerDefaults = Structure._READER.prototype._pointerDefaults;
            (function(types, parentScope) {
                parentScope.prototype._pointerDefaults = parentScope._READER.prototype._pointerDefaults;
                parentScope.prototype._floatDefaults = parentScope._READER.prototype._floatDefaults;
                var f0 = types["0x95570979dae93deb"]._FIELD;
                parentScope.prototype.adoptSource = f0.adopt(0);
                parentScope.prototype.getSource = f0.get(0, 0);
                parentScope.prototype.hasSource = f0.has(0);
                parentScope.prototype.initSource = f0.init(0);
                parentScope.prototype.disownSource = f0.disown(0);
                parentScope.prototype.disownReadOnlySource = f0.disownReader(0);
                parentScope.prototype.setSource = f0.set(0);
                var f1 = builder.Text._FIELD;
                parentScope.prototype.adoptValue = f1.adopt(8);
                parentScope.prototype.getValue = f1.get(8, 1);
                parentScope.prototype.hasValue = f1.has(8);
                parentScope.prototype.initValue = f1.init(8);
                parentScope.prototype.disownValue = f1.disown(8);
                parentScope.prototype.disownReadOnlyValue = f1.disownReader(8);
                parentScope.prototype.setValue = f1.set(8);
            })(types, Structure);
            parentScope.Message = Structure;
        })(types, Structure);
        Structure.prototype._pointerDefaults = Structure._READER.prototype._pointerDefaults;
        (function(types, parentScope) {
            parentScope.prototype._pointerDefaults = parentScope._READER.prototype._pointerDefaults;
            parentScope.prototype._floatDefaults = parentScope._READER.prototype._floatDefaults;
            var f0 = builder.lists.struct(types["0xd3e128c467576313"])._FIELD;
            parentScope.prototype.adoptMessages = f0.adopt(0);
            parentScope.prototype.getMessages = f0.get(0, 0);
            parentScope.prototype.hasMessages = f0.has(0);
            parentScope.prototype.initMessages = f0.init(0);
            parentScope.prototype.disownMessages = f0.disown(0);
            parentScope.prototype.disownReadOnlyMessages = f0.disownReader(0);
            parentScope.prototype.setMessages = f0.set(0);
        })(types, Structure);
        parentScope.Server = Structure;
    })(scope, builders);
    return builders;
});