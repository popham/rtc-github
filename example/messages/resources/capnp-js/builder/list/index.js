define([ "../../reader/list/index", "../primitives", "../Data", "../Text", "./structure", "./pointer", "./Void", "./Bool", "./primitive" ], function(reader, encode, Data, Text, structure, pointer, Void, Bool, primitive) {
    return {
        structure: structure,
        list: pointer,
        Void: Void,
        Bool: Bool,
        Int8: primitive(reader.Int8, encode.int8),
        Int16: primitive(reader.Int16, encode.int16),
        Int32: primitive(reader.Int32, encode.int32),
        Int64: primitive(reader.Int64, encode.int64),
        UInt8: primitive(reader.UInt8, encode.uint8),
        UInt16: primitive(reader.UInt16, encode.uint16),
        UInt32: primitive(reader.UInt32, encode.uint32),
        UInt64: primitive(reader.UInt64, encode.uint64),
        Float32: primitive(reader.Float32, encode.float32),
        Float64: primitive(reader.Float64, encode.float64),
        Data: pointer(Data),
        Text: pointer(Text)
    };
});