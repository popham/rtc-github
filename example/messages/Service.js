define(['js-signals', 'capnp-js', 'capnp-js/nonframed', 'rtc/toCandidate', 'client.capnp.d/builders', 'server.capnp.d/readers'], function (
            signals,   capnp,               nonframed,       toCandidate,   client,                    server) {

    var allocator = new capnp.Allocator();

    var LocalClient = function (service, worker) {
        var messaged = this.messaged = new signals.Signal();

        this._service = service;
        this._worker = worker;
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
        this._worker.postMessage(nonframed.fromStruct(root));
    };

    var DataChannelClient = function (user, peerSignaller, worker) {
        /*
         * No leading underscore on private variables because this entire class
         * is private.
         */
        this.user = user;
        this.peer = peerSignaller;
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
            this.channel.binaryType = 'arraybuffer';

            // Attach user id (reject client's authority), and then forward the
            // message on to the worker.
            this.channel.onmessage = function (e) {
                var arena = Allocator.constCast(nonframed.toArena(new Uint8Array(e.data)));
                var root = arena.getRoot(client.Client);
                root.getSource().setUser(this.user);
                console.log('RTC channel sending message to worker.');
                this.worker.postMessage(nonframed.fromStruct(root));
            }.bind(this);

            // Ignore subsequent data channels.
            this.connection.ondatachannel = null;
        }.bind(this);
    };

    DataChannelClient.prototype.answer = function (offer) {
        var ans = function (description) {
            this.peer.answer(this.user.getId(), description);
        }.bind(this);

        var connection = this.connection;
        var offer = new RTCSessionDescription({
            sdp : offer.getSdp().toString(),
            type : 'offer'
        });

        connection.setRemoteDescription(
            offer,
            function () {
                connection.createAnswer(
                    function (description) {
                        connection.setLocalDescription(
                            description,
                            function () {
                                ans(description);
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

    DataChannelClient.prototype.addIceCandidate = function (ice) {
        this.connection.addIceCandidate(toCandidate(ice));
    };

    var Service = function (signal, session) {
        this._hostUser = session.getUser();
        this._remoteClients = {};
        this._localClients = [];
        this._worker = new Worker('service/kernel.js');
        this._signal = signal;

        this._worker.onmessage = function (e) {
            var k;

            for (k in this._remoteClients) {
                this._remoteClients[k].channel.send(e.data);
            }

            if (this._localClients.length > 0) {
                var root = nonframed.toArena(e.data).getRoot(server.Server);
                for (k=0; k<this._localClients.length; ++k) {
                    root.getMessages().forEach(function (message) {
                        this._localClients[k].messaged.dispatch(message);
                    }.bind(this));
                }
            }
        }.bind(this);

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
            case peer.ICE:
                client.addIceCandidate(peer.getIce());
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
