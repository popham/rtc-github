define([ "./adopt", "./disown", "./get", "./has", "./init", "./set" ], function(adopt, disown, get, has, init, set) {
    return {
        adopt: adopt,
        disown: disown,
        get: get,
        has: has,
        init: init,
        set: set,
        install: function(Nonstruct) {
            adopt(Nonstruct);
            disown(Nonstruct);
            get(Nonstruct);
            has(Nonstruct);
            init(Nonstruct);
            set(Nonstruct);
        }
    };
});