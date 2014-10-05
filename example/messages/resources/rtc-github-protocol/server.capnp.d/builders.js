define(['capnp-js/builder/Allocator', 'capnp-js/builder/index', 'capnp-js/reader/index', './bScope', './readers'], function(Allocator, builder, reader, scope, readers) { /** Loading `readers` guarantees that reader prototypes have been populated.* Imagine using a builder, `b`:  If the underlying data is shared read-only* by `b.asReader()`, then the prototype of this reader would not have been* initialized unless some external code imported `readers`.*/
    var builders = {};
    var allocator = new Allocator();
    builders.Server = (function() {
        var Structure = scope["0x898617f522cfa2ab"];
        Structure.prototype.getSessionId = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.sessionId, this._arena, pointer);
            }
            return builder.Data._deref(this._arena, pointer);
        };
        Structure.prototype.setSessionId = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            builder.Data._set(this._arena, pointer, value);
        };
        Structure.prototype.hasSessionId = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptSessionId = function(value) {
            builder.Data._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownSessionId = function() {
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
        var Builder_offers = builder.lists.structure(scope["0x95570979dae93deb"]);
        Structure.prototype.initOffers = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return Builder_offers._init(this._arena, pointer, n);
        };
        Structure.prototype.setOffers = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            Builder_offers._set(this._arena, pointer, value);
        };
        Structure.prototype.getOffers = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.deep(this._defaults.offers, this._arena, pointer);
            }
            return Builder_offers._deref(this._arena, pointer);
        };
        Structure.prototype.hasOffers = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    return builders;
});