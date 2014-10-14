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
        var s = '';
        for (var i=0; i<e.data.length; ++i) s+=' '+e.data[i];
        console.log(s);

        var message = packet.toArena(e.data).getRoot(client.Client);
        var root = allocator.initRoot(server.Server);
        var m = root.initMessages(1).get(0);
        console.log('WORKER');
        console.log(message._dataBytes);
        console.log(message._pointersBytes);
        console.log(message.getSource().which());
        m.setSource(message.getSource().getUser());
        m.setValue(message.getValue());
        postMessage(packet.fromStruct(m));
    };
});
