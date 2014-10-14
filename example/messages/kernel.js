importScripts('resources/requirejs/require.js');
requirejs.config({
    baseUrl : '.',
    paths : {
        'capnp-js' : 'resources/capnp-js',
        'capnp' : 'capnp'
    }
});

requirejs(['capnp-js/packet', 'capnp-js/builder/Allocator', 'capnp/client.capnp.d/readers', 'capnp/server.capnp.d/builders'], function (
                     packet,                    Allocator,         client,                         server) {

    var allocator = new Allocator();

    onmessage = function (e) {
        var message = packet.toArena(e.data).getRoot(client.Client);
        var root = allocator.init(server.Server);
        var m = root.initMessages(1).get(0);
        m.setSource(message.getSource().getUser());
        m.setValue(message.getValue());
        postMessage(packet.fromStruct(m));
    };
});
