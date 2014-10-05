define([ "./primitives", "./fields", "./structure", "./group", "./list/index", "./AnyPointer", "./Text", "./Data", "./copy/index", "./zero" ], function(primitives, fields, structure, group, lists, AnyPointer, Text, Data, copy, zero) {
    return {
        primitives: primitives,
        fields: fields,
        structure: structure,
        group: group,
        lists: lists,
        AnyPointer: AnyPointer,
        Text: Text,
        Data: Data,
        copy: copy,
        zero: zero
    };
});