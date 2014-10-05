define([ "./primitives", "./fields", "./structure", "./group", "./list/index", "./AnyPointer", "./Text", "./Data", "./isNull" ], function(primitives, fields, structure, group, lists, AnyPointer, Text, Data, isNull) {
    return {
        primitives: primitives,
        fields: fields,
        structure: structure,
        group: group,
        lists: lists,
        AnyPointer: AnyPointer,
        Text: Text,
        Data: Data,
        isNull: isNull
    };
});