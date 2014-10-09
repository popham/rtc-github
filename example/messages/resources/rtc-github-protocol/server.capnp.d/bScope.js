define(['./bTypes', '../client.capnp.d/bTypes', '../user.capnp.d/bTypes'], function(types, file0, file1) {
    var scope = {};
    var id;
    for (id in file0) {
        scope[id] = file0[id];
    }
    for (id in file1) {
        scope[id] = file1[id];
    }
    for (id in types) {
        scope[id] = types[id];
    }
    return scope;
});