define(['./rTypes', 'rtc-github-protocol/user.capnp.d/rTypes'], function(types, file0) {
    var scope = {};
    for (var id in types) {
        scope[id] = types[id];
    }
    scope["0x95570979dae93deb"] = file0["0x95570979dae93deb"];
    return scope;
});