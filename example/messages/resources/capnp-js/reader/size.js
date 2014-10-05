define([ "../wordAlign", "./layout/any", "./layout/structure", "./layout/list", "./list/meta", "./isNull" ], function(wordAlign, any, structure, list, meta, isNull) {
    var sequence = function(arena, iStart, iEnd) {
        var bytes = 0;
        for (;iStart.position < iEnd.position; iStart.position += 8) {
            bytes += pointer(arena, iStart);
        }
        return bytes;
    };
    var pointer = function(arena, pointer) {
        if (isNull(pointer)) {
            return 0;
        }
        var layout = any.safe(arena, pointer);
        var bytes;
        switch (layout.meta) {
          case 0:
            // Locals
            bytes = structure.dataBytes(pointer);
            bytes += structure.pointersBytes(pointer);
            // Follow pointers
            bytes += sequence(arena, {
                segment: layout.segment,
                position: layout.pointersSection
            }, {
                segment: layout.segment,
                position: layout.end
            });
            return bytes;

          case 1:
            // Locals
            var m = meta(layout);
            if (m.layout === 1) {
                bytes = layout.length >>> 3;
                if (layout.length & 7) bytes += 1;
                return wordAlign(bytes);
            } else if (m.layout === 7) {
                bytes = 8;
            } else {
                bytes = 0;
            }
            bytes += layout.length * (layout.dataBytes + layout.pointersBytes);
            bytes = wordAlign(bytes);
            if (layout.pointersBytes) {
                var iPointer = {
                    segment: layout.segment,
                    position: layout.begin + layout.dataBytes
                };
                for (var i = 0; i < layout.length; ++i, iPointer.position += layout.dataBytes) {
                    bytes += sequence(arena, iPointer, {
                        segment: iPointer.segment,
                        position: iPointer.position + layout.pointersBytes
                    });
                }
            }
            return bytes;
        }
    };
    return {
        blobs: pointer
    };
});