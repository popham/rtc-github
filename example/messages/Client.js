define(['js-signals', 'capnp-js/nonframed', 'capnp-js/builder/Allocator', './toCandidate', './capnp/client.capnp.d/builders', './capnp/server.capnp.d/readers'], function (
            signals,            nonframed,                    Allocator,     toCandidate,           client,                            server) {

    var allocator = new Allocator();

    var DataChannelServer = function (targetUserId, peerSignaller) {
        var messaged = this.messaged = new signals.Signal();
        this.peer = peerSignaller;
        this._channel = null;
        var connection = this.connection = new RTCPeerConnection(
            {
                iceServers : [
                    { url : 'stun:stun.l.google.com:19302' }
                ]
            },
            {optional : [{'DtlsSrtpKeyAgreement' : true}]}
        );

        connection.onicecandidate = function (e) {
            if (e.candidate) {
                // Chrome fires an ice candidate event without an attached
                // candidate.
                peerSignaller.offerIce(targetUserId, e.candidate);
            }
        };

        this._channel = connection.createDataChannel('chat', {
            ordered : false,
            maxRetransmits : 0
        });
        this._channel.binaryType = 'arraybuffer';

        this._channel.onmessage = function (e) {
            var arena = nonframed.toArena(new Uint8Array(e.data));
            var root = arena.getRoot(server.Server);
            root.getMessages().forEach(function (message) {
                messaged.dispatch(message);
            });
        };

        this._channel.onerror = console.log;

        this._channel.onclose = console.log;

        connection.createOffer(
            function (description) {
                connection.setLocalDescription(
                    description,
                    function () {
                        peerSignaller.offer(targetUserId, connection.localDescription);
                    },
                    console.log
                );
            },
            console.log
        );
    };

    DataChannelServer.prototype.finalize = function (answer) {
        this.connection.setRemoteDescription(
            new RTCSessionDescription({
                type : 'answer',
                sdp : answer.getSdp().asString()
            }),
            function () { console.log('Successfully finalized the peer connection'); },
            console.log
        );
    };

    DataChannelServer.prototype.addIceCandidate = function (ice) {
        this.connection.addIceCandidate(toCandidate(ice));
    };

    var Client = function (targetUserId, signal) {
        this._server = new DataChannelServer(targetUserId, signal.peer);
        this.messaged = this._server.messaged;
        this._signal = signal;

        signal.peered.add(this._onPeered = function (peer) {
            switch (peer.which()) {
            case peer.ANSWER: this._server.finalize(peer.getAnswer()); break;
            case peer.ICE:
                console.log('Candidate: '+peer.getIce().getCandidate().asString());
                this._server.addIceCandidate(peer.getIce());
                break;
            default:
                console.log('Client only accepts ice candidates or answers');
            }
        }.bind(this));
    };

    Client.prototype.send = function (message) {
        var root = allocator.initRoot(client.Client);
        root.setMessage(message);

        // This is a good place for a queue.
        this._server._channel.send(nonframed.fromStruct(root));
    };

    Client.prototype.kill = function () {
        this._signal.peered.remove(this._onPeered);

        this._server = null;
        this.messaged = null;
        this._signal = null;
    };

    return Client;
});
