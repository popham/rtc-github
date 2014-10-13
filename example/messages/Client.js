define(['js-signals', 'capnp-js/packet', 'capnp-js/builder/Allocator', './capnp/client.capnp.d/readers', './capnp/server.capnp.d/readers'], function (
            signals,            packet,                    Allocator,           client,                           server) {

    var error = function (e) { throw new Error(e); };

    var allocator = new Allocator();

    var DataChannelServer = function (targetUserId, peerSignaller) {
        this.messaged = new signals.Signal();
        this.peer = peerSignaller;
        this.channel = null;
        var connection = this.connection = new RTCPeerConnection(
            {
                iceServers : [
                    { url : 'stun:stun.l.google.com:19302' }
                ]
            }, {
                optional : [
                    { DtlsSrtpKeyAgreement : true },
                    { RtpDataChannels : true }
                ]
            }
        );

        connection.onicecandidate = function (e) {
            if (e.candidate) {
                peerSignaller.iceCandidate(targetUserId, e.candidate);
            }
        };

        connection.ondatachannel = function (e) {
            var messaged = this.messaged;
            this.channel = e.channel;

            this.channel.onmessage = function (e) {
                var arena = packet.toArena(e.data);
                var root = arena.getRoot(server.Server);
                root.getMessages().forEach(function (message) {
                    messaged.dispatch(message);
                });
            };
        }.bind(this);

        connection.createOffer(
            function (sdp) {
                connection.setLocalDescription(
                    sdp,
                    function () {
                        peerSignaller.offer(targetUserId, sdp);
                    },
                    error
                );
            },
            error
        );
    };

    DataChannelServer.prototype.finalize = function (answer) {
        this.connection.setRemoteDescription(
            new RTCSessionDescription(answer.getSdp().asString()),
            function () {},
            error
        );
    };

    DataChannelServer.prototype.addIceCandidate = function (candidate) {
        this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    var Client = function (targetUserId, signal) {
        this._server = new DataChannelServer(signal.peer);
        this.messaged = this._server.messaged;
        this._signal = signal;

        signal.peered.add(this._onPeered = function (peer) {
            switch (peer.which()) {
            case peer.ANSWER: this._server.finalize(peer.getAnswer()); break;
            case peer.ICE_CANDIDATE:
                this._server.addIceCandidate(peer.getIceCandidate());
                break;
            default:
                throw new Error('Client only accepts ice candidates or answers');
            }
        }.bind(this));
    };

    Client.prototype.send = function (message) {
        var root = allocator.initRoot(client.Client);
        root.setMessage(message);
        this._server.channel.send(packet.fromStruct(root));
    };

    Client.prototype.kill = function () {
        this._signal.remove(this._onPeered);

        this._server = null;
        this.messaged = null;
        this._signal = null;
    };

    return Client;
});