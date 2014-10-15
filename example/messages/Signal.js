define(['when', 'js-signals', 'capnp-js/packet', 'capnp-js/builder/Allocator', 'rtc-github-protocol/server.capnp.d/readers', 'rtc-github-protocol/client.capnp.d/builders', './settings'], function (
         when,      signals,            packet,                    Allocator,                       server,                                       client,                      settings) {

    var allocator = new Allocator();

    var Signal = function (timeout) {
        timeout = timeout || 5000;

        // The session resolves on receipt of an introductory session.
        this._deferredConnection = when.defer();
        this.connecting = this._deferredConnection.promise;
        setTimeout(
            this._deferredConnection.reject,
            timeout,
            ['Signalling connection timeout']
        );

        this.hosts = Signal.EMPTY_HOSTS;

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

    Signal.EMPTY_HOSTS = server.EMPTY_HOSTS_UPDATE;

    Signal.prototype.service = function (isOffering) {
        var request = allocator.initRoot(client.Client);
        request.initService();
        request.getService().setIsOffering(isOffering);
        this._send(request);
    };

    Signal.prototype.kill = function () {
        this.connecting = null;
        this.hosts = null;

        this.hostsUpdated.removeAll();
        this.peered.removeAll();
        this.closed.removeAll();

        this._socket.onclose = null;
        this._socket.close();
        this._socket = null;

        this._deferredConnection.reject('Signal killed');
    };

    Signal.prototype._reconnect = function () {
        var socket = this._socket = new WebSocket(settings.socketServer);
        socket.binaryType = 'arraybuffer';

        socket.onmessage = function (e) {
            var message = packet.toArena(new Uint8Array(e.data)).getRoot(server.Server);
            switch (message.which()) {
            case message.SESSION:
                this._deferredConnection.resolve(message.getSession());
                break;
            case message.HOSTS_UPDATE:
                this.hosts = message.getHostsUpdate();
                this.hostsUpdated.dispatch(this.hosts);
                break;
            case message.PEER:
                this.peered.dispatch(message.getPeer());
                break;
            }
        }.bind(this);

        socket.onclose = function (e) {
            this._deferredConnection.reject();
            this._deferredConnection = when.defer();
            this.connecting = this._deferredConnection.promise;

            this.closed.dispatch(e.wasClean, e.code, e.reason);

            this.hosts = Signal.EMPTY_HOSTS;
            this.hostsUpdated.dispatch(this.hosts);

            this._reconnect();
        }.bind(this);
    };

    Signal.prototype._send = function (request) {
        this._socket.send(packet.fromStruct(request));
    };

    return Signal;
});
