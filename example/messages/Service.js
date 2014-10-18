define(['js-signals', 'capnp-js/packet', 'capnp-js/builder/Allocator', './capnp/client.capnp.d/builders', './capnp/server.capnp.d/readers'], function (
            signals,            packet,                    Allocator,           client,                            server) {

    var allocator = new Allocator();

    var LocalClient = function (service, worker) {
        var messaged = this.messaged = new signals.Signal();

        this._service = service;
        this._worker = worker;

        worker.onmessage = function (e) {
            console.log('LocalClient receiving data...')
            var root = packet.toArena(e.data).getRoot(server.Server);
            messaged.dispatch(root);
        };
    };

    LocalClient.prototype.send = function (message) {
        var user = this._service.getOwner();
        if (user === null) {
            throw new Error('Host user information unavailable');
        }
        var root = allocator.initRoot(client.Client);
        root.getSource().setUser(user);
        root.setMessage(message);
        console.log('LocalClient sending message to worker.');
        this._worker.postMessage(packet.fromStruct(root));
    };

    var DataChannelClient = function (user, peerSignaller, worker) {
        /*
         * No leading underscore on private variables because this entire class
         * is private.
         */
        this.user = user;
        var peer = this.peer = peerSignaller;
        this.worker = worker;
        this.channel = null;
        this.connection = new RTCPeerConnection(
            {
                iceServers : [
                    { url : 'stun:stun.l.google.com:19302' }
                ]
            },
            {optional : [{'DtlsSrtpKeyAgreement' : true}]}
        );

        this.connection.onicecandidate = function (e) {
            if (e.candidate) {
                peerSignaller.offerIce(user.getId(), e.candidate);
            }
        };

        this.connection.ondatachannel = function (e) {
            this.channel = e.channel;

            // Attach user id (reject client's authority), and then forward the
            // message on to the worker.
            this.channel.onmessage = function (e) {
                var arena = Allocator.constCast(packet.toArena(e.data));
                var root = arena.getRoot(client.Client);
                root.getSource().setUser(this.user);
                console.log('RTC channel sending message to worker.');
                this.worker.postMessage(packet.fromStruct(root));
            }.bind(this);

            this.worker.onmessage = function (e) {
                console.log('RTC channel sending message to client.');

                // Forward server messages verbatim.
                this.channel.send(e.data);
            }.bind(this);

            // Ignore subsequent data channels.
            this.connection.ondatachannel = null;
        }.bind(this);
    };

    DataChannelClient.prototype.answer = function (offer) {
        var connection = this.connection;

        var offer = new RTCSessionDescription({
            sdp : offer.getSdp().asString(),
            type : 'offer'
        });

        connection.setRemoteDescription(
            offer,
            function () {
                console.log('RemoteDescription successfully set');
                connection.createAnswer(
                    function (sdp) {
                        console.log('createAnswer callback');
                        connection.setLocalDescription(
                            sdp,
                            function () {
                                console.log('answering');
                                peer.answer(sdp);
                            },
                            console.log
                        );
                    },
                    console.log
                );
            },
            function (e) { console.log('failing'); console.log(e); }
        );
    };

    DataChannelClient.prototype.addIceCandidate = function (candidate) {
        this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    var Service = function (signal, session) {
        this._hostUser = session.getUser();
        this._remoteClients = {};
        this._localClients = [];
        this._worker = new Worker('kernel.js');
        this._signal = signal;

        signal.peered.add(this._onPeered = function (peer) {
            var user = peer.getSource().getUser();
            var client = this._remoteClients[user.getId()];
            if (client === undefined) {
                client = new DataChannelClient(
                    user,
                    this._signal.peer,
                    this._worker
                );
                this._remoteClients[user.getId()] = client;
            }

            switch (peer.which()) {
            case peer.OFFER: client.answer(peer.getOffer()); break;
            case peer.ICE_CANDIDATE:
                client.addIceCandidate(peer.getIceCandidate());
                break;
            default:
                throw new Error('Service only accepts ice candidates or offers');
            }
        }.bind(this));

        signal.service(true);
    };

    Service.prototype.getOwner = function () {
        return this._hostUser;
    };

    Service.prototype.createLocalClient = function () {
        var client = new LocalClient(this, this._worker);
        this._localClients.push(client);
        return client;
    };

    Service.prototype.kill = function () {
        this._hostUser = null;
        this._remoteClients = null;
        this._worker = null;
        this._signal.service(false);
        this._signal.peered.remove(this._onPeered);
        this._signal = null;
    };

    return Service;
});
