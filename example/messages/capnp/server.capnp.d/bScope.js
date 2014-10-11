define(['./bTypes', '../undefined.d/bTypes', 'rtc-github-protocol/user.capnp.d/bTypes'], function(types, file0, file1) {
    var scope = {};
    for (var id in types) {
        scope[id] = types[id];
    }
    scope["0xd3e128c467576313"] = file0["0xd3e128c467576313"];
    scope["0x95570979dae93deb"] = file1["0x95570979dae93deb"];
    return scope;
});