define([ "./sizes" ], function(sizes) {
    return function(layout) {
        if (layout.dataBytes === null) {
            return {
                meta: 1,
                layout: 1,
                dataBytes: layout.dataBytes,
                pointersBytes: layout.pointersBytes
            };
        } else if (layout.dataBytes + layout.pointersBytes > 8) {
            return {
                meta: 1,
                layout: 7,
                dataBytes: layout.dataBytes,
                pointersBytes: layout.pointersBytes
            };
        } else {
            return {
                meta: 1,
                layout: sizes[layout.dataBytes][layout.pointersBytes],
                dataBytes: layout.dataBytes,
                pointersBytes: layout.pointersBytes
            };
        }
    };
});