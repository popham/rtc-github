define([ "./adopt", "./deref", "./init", "./initOrphan", "./set" ], function(adopt, deref, init, initOrphan, set) {
    return {
        adopt: adopt,
        deref: deref,
        init: init,
        initOrphan: initOrphan,
        set: set,
        install: function(Nonstruct) {
            Nonstruct._deref = deref(Nonstruct);
            Nonstruct._adopt = adopt(Nonstruct);
            Nonstruct._init = init(Nonstruct);
            Nonstruct._initOrphan = initOrphan(Nonstruct);
            Nonstruct._set = set;
        }
    };
});