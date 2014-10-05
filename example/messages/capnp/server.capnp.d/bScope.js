define(['./bTypes'], function(types) {
    var scope = {};
    var id;
    for (id in types) {
        scope[id] = types[id];
    }
    return scope;
});