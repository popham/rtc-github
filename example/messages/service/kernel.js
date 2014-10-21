importScripts('../resources/requirejs/require.js');
requirejs.config({
    baseUrl : '../resources',
    paths : {
        'capnp' : '../capnp'
    }
});

requirejs(['capnp-js/nonframed', 'capnp-js/builder/Allocator', 'capnp/client.capnp.d/readers', 'capnp/server.capnp.d/builders'], function (
                     nonframed,                    Allocator,         client,                         server) {

    var allocator = new Allocator();

    onmessage = function (e) {
        console.log('Kernel receiving data.');
        var request = nonframed.toArena(e.data).getRoot(client.Client);
        var response = allocator.initRoot(server.Server);
        var m = response.initMessages(1).get(0);
        m.setSource(request.getSource().getUser());
        m.setValue(request.getMessage());
        console.log('Kernel posting data.');
        postMessage(nonframed.fromStruct(response));
    };
});
