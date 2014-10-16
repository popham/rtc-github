define(['capnp-js/reader/index'], function(reader) {
    var types = {};
    types['0xac8a22741af618bd'] = {
        DATA: 0,
        AUDIO: 1,
        VIDEO: 2
    };
    types["0xe5e90b52fd6c402e"] = reader.structure(7, 16, 16);
    types["0xf2ae185395b2f8ef"] = reader.structure(7, 8, 8);
    return types;
});