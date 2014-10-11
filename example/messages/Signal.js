define(['cookies', 'js-signals', 'capnp-js/packet', 'capnp-js/builder/Allocator', 'signal-protocol/server.capnp.d/readers', 'signal-protocol/client.capnp.d/builders', './settings'], function (
         cookies,      signals,            packet,                    Allocator,                   server,                                   client,                      settings) {

    var allocator = new Allocator();

    var Signal = function () {
        this.sessioned = new signals.Signal();
        this.hostsUpdated = new signals.Signal();
        this.peered = new signals.Signal();
        this.closed = new signals.Signal();

        this._socket = null;

        this._reconnect();

        this.peer = {
            offer : function (uid, sdp) {
                var root = allocator.initRoot(client.Client);
                var peer = root.initPeer();
                peer.getTarget().setUserId(uid);
                var offer = peer.initOffer();
                offer.setSdp(sdp);
                this._send(root);
            }.bind(this),
            answer : function (uid, sdp) {
                var root = allocator.initRoot(client.Client);
                var peer = root.initPeer();
                peer.getTarget().setUserId(uid);
                var answer = peer.initAnswer();
                answer.setSdp(sdp);
                this._send(root);
            }.bind(this),
            iceCandidate : function (uid, candidate) {
                var root = allocator.initRoot(client.Client);
                var peer = root.initPeer();
                peer.getTarget().setUserId(uid);
                peer.setIceCandidate(candidate);
                this._send(root);
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
            var message = packet.toArena(e.data).getRoot(server.Server);
            switch (message.which()) {
            case message.SESSION:
                this.sessioned.dispatch(message.getSession());
                break;
            case message.HOSTS_UPDATE:
                this.hostsUpdated.dispatch(message.getHostsUpdate());
                break;
            case message.PEER:
                this.peered.dispatch(message.getPeer());
                break;
            }
        }.bind(this);

        socket.onclose = function (e) {
            this._reconnect();
            this.closed.dispatch(e.wasClean, e.code, e.reason);
        }.bind(this);
    };

    Signal.prototype._send = function (request) {
        this._socket.send(packet.fromStruct(request));
    };

    return Signal;
});
