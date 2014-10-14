define([ "../../reader/layout/list" ], function(layout) {
    return function(List) {
        return function(arena, pointer) {
console.log('LAYOUT');
var a = layout.unsafe(arena, pointer);
for (var k in a) console.log(''+k+' : '+a[k]);
            return new List(arena, layout.unsafe(arena, pointer), false);
        };
    };
});
