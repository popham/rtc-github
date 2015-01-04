define([ "../reader/generic", "./structure" ], function(reader, structure) {
    return function(Reader) {
        var specials = {};
        var scopedGenerics = {};
        var specialize = function(Reader, parent, params, populate) {
            Structure = structure(Reader);
            Structure._PARENT = parent;
            Structure._PARAMS = params;
            populate(Structure);
            return Structure;
        };
        var Generic = {
            fixScope: function(Reader, parent) {
                var ScopedGeneric = {
                    _READER: Reader,
                    _GENERIC: Generic,
                    _memoize: function(specialHash, params) {
                        /*
                         * The plugin provides a `_populate` method to fill in
                         * the structure's fields and nodes.
                         */
                        var Structure = specials[specialHash];
                        if (Structure === undefined) {
                            Structure = specialize(Reader._memoize(specialHash, params), parent, params, ScopedGeneric._populate);
                            specials[specialHash] = Structure;
                        }
                        return Structure;
                    },
                    _bindParams: function(params) {
                        var hash = parent._HASH + ":" + id + "|" + params.map(function(p) {
                            return "(" + p._HASH + ")";
                        }).join("|");
                        return ScopedGeneric._memoize(hash, params);
                    }
                };
                return ScopedGeneric;
            },
            bindScope: function(parent) {
                return Generic.memoizeScope(parent._HASH + ":" + Reader._ID, parent);
            },
            memoizeScope: function(scopedHash, parent) {
                var ScopedGeneric = scopedGenerics[scopedHash];
                if (ScopedGeneric === undefined) {
                    ScopedGeneric = Generic.fixScope(Reader.memoizeScope(scopedHash, parent._READER), parent);
                    scopedGenerics[scopedHash] = ScopedGeneric;
                }
                return ScopedGeneric;
            }
        };
        return Generic;
    };
});