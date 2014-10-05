define(['./rTypes', '../user.capnp.d/rTypes'], function(types, file0) {
    var scope = {};
    var id;
    for (id in file0) {
        scope[id] = file0[id];
    }
    for (id in types) {
        scope[id] = types[id];
    }
    return scope;
});