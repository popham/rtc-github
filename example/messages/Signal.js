define(['cookies', 'js-signals', 'capnp-js/stream', 'capnp-js/builder/Allocator', 'signal/server.capnp.d/readers', 'signal/client.capnp.d/builders', './settings'], function (
         cookies,      signals,            stream,                    Allocator,          server,                          client,                      settings) {

    var allocator = new Allocator();

    var Signal = function () {
        this.messaged = new signals.Signal();
        this.closed = new signals.Signal();
        this._socket = null;

        this._reconnect();

        this.peer = {
            offer : function (uid, sdp) {
                var request = allocator.initRoot(client.Client);

                request.getTarget().setUserId(uid);

                var peer = request.initPeer();
                var offer = peer.initOffer();
                offer.setSdp(sdp);

                this._send(request);
            }.bind(this),
            answer : function (uid, sdp) {
                var request = allocator.initRoot(client.Client);

                request.getTarget().setUserId(uid);

                var peer = request.initPeer();
                var answer = peer.initAnswer();
                answer.setSdp(sdp);

                this._send(request);
            }.bind(this),
            iceCandidate : function (uid, candidate) {
                var request = allocator.initRoot(client.Client);

                request.getTarget().setUserId(uid);

                var peer = request.initPeer();
                peer.setIceCandidate(candidate);

                this._send(request);
            }.bind(this)
        };
    };

    Signal.prototype.service = function (offer) {
        var request = allocator.initRoot(client.Client);
        request.initService();
        request.getService().setOffer(offer);
        this._send(request);
    };

    Signal.prototype._reconnect = function () {
        var socket = this._socket = new WebSocket(settings.socketServer);

        socket.onmessage = function (e) {
            var response = stream.toArena(e.data).getRoot(server.Server);
            this.messaged.dispatch(response);
        }.bind(this);

        socket.onclose = function (e) {
            this._reconnect();
            this.closed.dispatch(e.wasClean, e.code, e.reason);
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

    Signal.prototype._send = function (request) {
        stream.fromStruct(request).forEach(function (segment) {
            this._socket.send(segment);
        }.bind(this));
    };

    return Signal;
});
