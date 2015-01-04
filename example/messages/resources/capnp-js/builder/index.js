define([ "./primitives", "./fields", "./generic", "./structure", "./group", "./list/index", "./AnyPointer", "./Text", "./Data", "./zero" ], function(primitives, fields, generic, structure, group, lists, AnyPointer, Text, Data, zero) {
    return {
        primitives: primitives,
        fields: fields,
        generic: generic,
        structure: structure,
        group: group,
        lists: lists,
        AnyPointer: AnyPointer,
        Text: Text,
        Data: Data,
        zero: zero
    };
});