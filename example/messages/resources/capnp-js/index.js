define([ "./reader/index", "./builder/index", "./builder/Allocator" ], function(reader, builder, Allocator) {
    return {
        reader: reader,
        builder: builder,
        Allocator: Allocator
    };
});