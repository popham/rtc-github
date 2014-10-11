define(['./rTypes'], function(types) {
    var scope = {};
    for (var id in types) {
        scope[id] = types[id];
    }
    return scope;
});