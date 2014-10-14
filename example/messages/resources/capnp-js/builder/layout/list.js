define([ "../far", "./structure" ], function(far, structure) {
    var lo = function(pointer, layout, length) {
        pointer.segment[pointer.position + 4] = length << 3 | layout;
        pointer.segment[pointer.position + 5] = length << 11;
        pointer.segment[pointer.position + 6] = length << 19;
        pointer.segment[pointer.position + 7] = length << 27;
    };
    var composite = function(pointer, blob, meta, length) {
        lo(pointer, 7, length * (meta.dataBytes + meta.pointersBytes >>> 3));
        blob.segment[blob.position] = length << 2;
        blob.segment[blob.position + 1] = length << 10;
        blob.segment[blob.position + 2] = length << 18;
        blob.segment[blob.position + 3] = length << 26;
        structure.wordCounts(blob, meta.dataBytes >>> 3, meta.pointersBytes >>> 3);
    };
    var intrasegment = function(pointer, blob, meta, length) {
        // Non-bitshift to avoid possible sign-bit truncation.
        var offset = (blob.position - pointer.position - 8) / 8;
        pointer.segment[pointer.position] = offset << 2 | 1;
        pointer.segment[pointer.position + 1] = offset >>> 6;
        pointer.segment[pointer.position + 2] = offset >>> 14;
        pointer.segment[pointer.position + 3] = offset >>> 22;
        if (meta.layout === 7) {
            composite(pointer, blob, meta, length);
        } else {
            lo(pointer, meta.layout, length);
        }
    };
    var preallocated = function(pointer, blob, meta, length) {
        if (pointer.segment === blob.segment) {
            intrasegment(pointer, blob, meta, length);
        } else {
            var land = {
                segment: blob.segment,
                position: blob.position - 8
            };
            // Build the local pointer.
            land.segment[land.position] = 1;
            // Zero offset by construction.
            lo(land, meta.layout, length);
            if (meta.layout === 7) {
                // Write the list's tag.
                structure.wordCounts(blob, meta.dataBytes >>> 3, meta.pointersBytes >>> 3);
            }
            // Point at the off-segment blob's local pointer.
            far.terminal(pointer, land);
        }
    };
    var intersegment = function(arena, pointer, blob, meta, length) {
        var land = arena._preallocate(pointer.segment, 8);
        if (land.segment === blob.segment) {
            // Single hop allocation success.
            far.terminal(pointer, land);
            intrasegment(land, blob, meta, length);
        } else {
            // Double hop fallback.
            // `land` references the far pointer's tag word.
            land.segment[land.position] = 1;
            if (meta.layout === 7) {
                composite(land, blob, meta, length);
            } else {
                lo(land, meta.layout, length);
            }
            // Update `land` to reference the far pointer's landing pad.
            land.position -= 8;
            far.preterminal(pointer, land);
            far.terminal(land, blob);
        }
    };
    var nonpreallocated = function(arena, pointer, blob, meta, length) {
        if (pointer.segment === blob.segment) {
            // Local reference.
            intrasegment(target, blob, meta, length);
        } else {
            // Nonlocal reference.
            intersegment(orphan._arena, pointer, blob, meta, length);
        }
    };
    return {
        preallocated: preallocated,
        nonpreallocated: nonpreallocated,
        intrasegment: intrasegment,
        intersegment: intersegment
    };
});