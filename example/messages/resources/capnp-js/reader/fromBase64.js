define([], function() {
    /*
     * Lifted from MDN:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding.
     */
    var b64ToUint6 = function(nChr) {
        return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
    };
    return function(sBase64) {
        sBase64 = sBase64.trim();
        var end = sBase64.indexOf("=");
        if (end >= 0) sBase64 = sBase64.slice(0, end);
        var nInLen = sBase64.length;
        var nOutLen = nInLen * 3 + 1 >> 2;
        var taBytes = new Uint8Array(nOutLen);
        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(sBase64.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return taBytes;
    };
});