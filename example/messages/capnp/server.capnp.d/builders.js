define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers', 'rtc-github-protocol/user.capnp.d/builders'], function(Allocator, builder, reader, scope, readers, file0) {
    var builders = {};
    var allocator = new Allocator();
    builders.Server = (function() {
        var Structure = scope["0xaf218e97ba298d14"];
        Structure.Message = (function() {
            var Structure = scope["0xd3e128c467576313"];
            var Builder_source = scope["0x95570979dae93deb"];
            Structure.prototype.initSource = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return Builder_source._init(this._arena, pointer, this._depth + 1);
            };
            Structure.prototype.getSource = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.setStructPointer(this._defaults.source._arena, this._defaults.source._layout(), this._arena, pointer);
                }
                return Builder_source._deref(this._arena, pointer);
            };
            Structure.prototype.setSource = function(value) {
                if (Builder_source._TYPE !== value._TYPE) throw new TypeError();
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                Builder_source._set(this._arena, pointer, value);
            };
            Structure.prototype.adoptSource = function(value) {
                if (Builder_source._TYPE !== value._TYPE) throw new TypeError();
                if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                Builder_source._adopt(this._arena, pointer, value);
            };
            Structure.prototype.disownSource = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                if (reader.isNull(pointer)) {
                    return Builder_source._initOrphan(this._arena);
                } else {
                    var instance = Builder_source._deref(this._arena, pointer);
                    this._arena._zero(pointer, 8);
                    instance._isOrphan = true;
                    return instance;
                }
            };
            Structure.prototype.disownAsReaderSource = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                var instance = Builder_source._READER._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            };
            Structure.prototype.hasSource = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 0
                };
                return (!reader.isNull(pointer));
            };
            Structure.prototype.getValue = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                if (reader.isNull(pointer)) {
                    builder.copy.pointer.setListPointer(this._defaults.value._arena, this._defaults.value._layout(), this._arena, pointer);
                }
                return builder.Text._deref(this._arena, pointer);
            };
            Structure.prototype.setValue = function(value) {
                var params = builder.Text._setParams(value);
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                builder.Text._set(this._arena, pointer, params);
            };
            Structure.prototype.initValue = function(n) {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                return builder.Text._init(this._arena, pointer, n + 1);
            };
            Structure.prototype.hasValue = function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 8
                };
                return (!reader.isNull(pointer));
            };
            Structure.prototype.adoptValue = function(value) {
                if (builder.Text._TYPE !== value._TYPE) {
                    throw new TypeError();
                }
                builder.Text._adopt(this._arena, {
                    segment: this._segment,
                    position: this._pointersSection + 8
                }, value);
            };
            Structure.prototype.disownValue = function() {
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
        })();
        var Builder_messages = builder.lists.structure(scope["0xd3e128c467576313"]);
        Structure.prototype.initMessages = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return Builder_messages._init(this._arena, pointer, n);
        };
        Structure.prototype.getMessages = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.messages._arena, this._defaults.messages._layout(), this._arena, pointer);
            }
            return Builder_messages._deref(this._arena, pointer);
        };
        Structure.prototype.setMessages = function(value) {
            if (Builder_messages._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            Builder_messages._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptMessages = function(value) {
            if (Builder_messages._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            Builder_messages._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownMessages = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                return Builder_messages._initOrphan(this._arena);
            } else {
                var instance = Builder_messages._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderMessages = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            var instance = Builder_messages._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasMessages = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});