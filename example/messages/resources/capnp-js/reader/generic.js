define([ "./structure" ], function(structure) {
    return function(preferredListEncoding, dataBytes, pointersBytes, id, paramCount) {
        /*
         * All specializations aggregate in a single object, where each
         * specialization has its full path for a key.
         */
        var specials = {};
        var scopedGenerics = {};
        var specialize = function(hash, parent, params, populate) {
            var Structure = structure(preferredListEncoding, dataBytes, pointersBytes, hash);
            Structure._PARENT = parent;
            Structure._PARAMS = params;
            populate(Structure);
            return Structure;
        };
        var Generic = {
            _ID: id,
            fixScope: function(parent) {
                var ScopedGeneric = {
                    _GENERIC: Generic,
                    _memoize: function(specialHash, params) {
                        /*
                         * The plugin provides a `_populate` method to fill in
                         * the structure's fields and nodes.
                         */
                        var Structure = specials[specialHash];
                        if (Structure === undefined) {
                            Structure = specialize(specialHash, parent, params, ScopedGeneric._populate);
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
                return Generic.memoizeScope(parent._HASH + ":" + id, parent);
            },
            memoizeScope: function(scopedHash, parent) {
                var ScopedGeneric = scopedGenerics[scopedHash];
                if (ScopedGeneric === undefined) {
                    ScopedGeneric = Generic.fixScope(parent);
                    scopedGenerics[scopedHash] = ScopedGeneric;
                }
                return ScopedGeneric;
            }
        };
        return Generic;
    };
});