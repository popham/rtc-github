define([], function () {

    return function (ice) {
        return new RTCIceCandidate({
            candidate : ice.getCandidate().asString(),
            sdpMid : ice.getSdpMId(),
            sdpMLineIndex : ice.getSdpMLineIndex()
        });
    };
});
