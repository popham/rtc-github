define(['./bTypes', '../user.capnp.d/bTypes', '../peer.capnp.d/bTypes'], function(types, file0, file1) {
    var scope = {};
    for (var id in types) {
        scope[id] = types[id];
    }
    scope["0x95570979dae93deb"] = file0["0x95570979dae93deb"];
    scope["0xe5e90b52fd6c402e"] = file1["0xe5e90b52fd6c402e"];
    return scope;
});