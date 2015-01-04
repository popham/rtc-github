importScripts('../resources/requirejs/require.js');
requirejs.config({
    baseUrl : '../resources'
});

requirejs(['capnp-js', 'capnp-js/nonframed', 'client.capnp.d/readers', 'server.capnp.d/builders'], function (
            capnp,               nonframed,   client,                   server) {

    var allocator = new capnp.Allocator();

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
