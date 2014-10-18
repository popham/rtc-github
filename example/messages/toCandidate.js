define(['rtc-github-protocol/peer.capnp.d/readers'], function (peer) {

    return function (ice) {
        var mid;
        switch (ice.getSdpMId()) {
        case peer.MediaIdentifier.DATA: mid = 'data'; break;
        case peer.MediaIdentifier.AUDIO: mid = 'audio'; break;
        case peer.MediaIdentifier.VIDEO: mid = 'video'; break;
        }

        return new RTCIceCandidate({
            candidate : ice.getCandidate().asString(),
            sdpMid : mid,
            sdpMLineIndex : ice.getSdpMLineIndex()
        });
    };
});
