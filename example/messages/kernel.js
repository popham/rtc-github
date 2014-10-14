importScripts('resources/requirejs/require.js');
requirejs.config({
    baseUrl : 'resources',
    paths : {
        'capnp' : '../capnp'
    }
});

requirejs(['capnp-js/packet', 'capnp-js/builder/Allocator', 'capnp/client.capnp.d/readers', 'capnp/server.capnp.d/builders'], function (
                     packet,                    Allocator,         client,                         server) {

    var allocator = new Allocator();

    onmessage = function (e) {
        var request = packet.toArena(e.data).getRoot(client.Client);
        var response = allocator.initRoot(server.Server);
        var m = response.initMessages(1).get(0);
        m.setSource(request.getSource().getUser());
        m.setValue(request.getMessage());
        postMessage(packet.fromStruct(response));
    };
});
