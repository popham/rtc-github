define([], function() {
    // Orphans are implemented
    var Wrapped = function(arena, pointer) {
        this.arena = arena;
        this.pointer = pointer;
    };
    Wrapped.prototype.asString = function() {
        return Text._deref(this.arena, this.pointer).asString();
    };
    Wrapped.prototype.asBytesNull = function() {
        return Text._deref(this.arena, this.pointer).asBytesNull();
    };
    Wrapped.prototype.asBytes = function() {
        return Text._deref(this.arena, this.pointer).asBytes();
    };
    Text.create = function(pointer) {
        var w = new Wrapped(pointer);
    };
});