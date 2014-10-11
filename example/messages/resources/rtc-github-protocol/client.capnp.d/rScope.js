define(['./rTypes', '../peer.capnp.d/rTypes'], function(types, file0) {
    var scope = {};
    for (var id in types) {
        scope[id] = types[id];
    }
    scope["0xe5e90b52fd6c402e"] = file0["0xe5e90b52fd6c402e"];
    return scope;
});