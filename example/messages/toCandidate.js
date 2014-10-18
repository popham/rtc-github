define([], function () {

    return function (ice) {
        return new RTCIceCandidate({
            candidate : ice.getCandidate(),
            sdpMid : ice.getSdpMId(),
            sdpMLineIndex : ice.getSdpMLineIndex()
        });
    };
});
