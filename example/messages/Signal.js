define(['cookies', 'js-signals', 'capnp-js/stream', 'capnp-js/builder/Allocator', 'signal/server.capnp.d/readers', 'signal/client.capnp.d/builders', './settings'], function (
         cookies,      signals,            stream,                    Allocator,          server,                          client,                      settings) {

    var allocator = new Allocator();

    var Connection = function () {
        this.onResponded = new signals.Signal();
        this.onClosed = new signals.Signal();
        this._socket = null;

        this._reconnect();

        this.peer = {
            offer : function (uid) {
                var request = allocator.initRoot(client.Client);
                request.initPeer();
                request.getPeer().getOffer().setTarget(uid);
                this._send(request);
            }.bind(this),
            answer : function (uid) {
                var request = allocator.initRoot(client.Client);
                request.initPeer();
                request.getPeer().getAnswer().setTarget(uid);
                this._send(request);
            }.bind(this)
        };
    };

    Connection.prototype.service = function (offer) {
        var request = allocator.initRoot(client.Client);
        request.initService();
        request.getService().setOffer(offer);
        this._send(request);
    };

    Connection.prototype._reconnect = function () {
        var socket = this._socket = new WebSocket(settings.socketServer);

        socket.onmessage = function (e) {
            var response = stream.toArena(e.data).getRoot(server.Server);
            this.onResponded.dispatch(response);
        }.bind(this);

        socket.onclose = function (e) {
            this._reconnect();
            this.onClosed.dispatch(e.wasClean, e.code, e.reason);
        }.bind(this);

        socket.onopen = function () {
            var cookie = cookies.get('session');
            if (cookie === undefined) cookie = '[0]';
            var sid = new Uint8Array(JSON.parse(cookie));
            var request = allocator.initRoot(client.Client);
            request.initSignaller();
            request.getSignaller().setInitialSessionId(sid);
            this._send(request);
        }.bind(this);
    };

    Connection.prototype._send = function (request) {
        stream.fromStruct(request).forEach(function (segment) {
            this._socket.send(segment);
        }.bind(this));
    };

    return Connection;
});
