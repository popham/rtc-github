define([ "./Arena" ], function(Arena) {
    var Allocator = function() {};
    Allocator.allocate = function(bytes) {
        var segment = new Uint8Array(bytes);
        return segment;
    };
    Allocator.zero = function(segment, position, length) {
        if (position + length > segment._position) throw new RangeError();
        var zeros = new Uint8Array(length);
        segment.set(zeros, position);
    };
    Allocator.constCast = function(reader) {
        var arena = new Arena(Allocator.allocate, Allocator.zero);
        if (reader._segments[0] && reader._segments[0].length >= 8) {
            arena._isRooted = true;
        } else {
            arena._isRooted = false;
        }
        arena._segments = reader._segments;
        return arena;
    };
    Allocator.prototype.createArena = function(size) {
        return new Arena(Allocator.allocate, Allocator.zero, size);
    };
    Allocator.prototype.initRoot = function(Struct) {
        var arena = this.createArena();
        return arena.initRoot(Struct);
    };
    Allocator.prototype.initOrphan = function(Type, optionalLength) {
        var arena = this.createArena();
        return arena.initOrphan(Type, optionalLength);
    };
    /*
     * Lifted from MDN:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding.
     */
    var b64ToUint6 = function(nChr) {
        return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
    };
    Allocator.prototype._fromBase64 = function(b64) {
        var nInLen = b64.indexOf("=");
        if (nInLen === -1) {
            nInLen = b64.length;
        }
        var nOutLen = nInLen * 3 + 1 >> 2;
        var arena = new Arena(Allocator.allocate, Allocator.zero, nOutLen);
        var blob = arena._allocate(nOutLen).segment;
        /*
         * Lifted from MDN:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding.
         */
        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; ++nInIdx) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(b64.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; ++nMod3, ++nOutIdx) {
                    blob[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return arena;
    };
    return Allocator;
});