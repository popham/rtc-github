define([], function() {
    var Terminal = function() {};
    Terminal.prototype.equiv = function(rhs) {
        return this === rhs;
    };
    var List = function(child) {
        this.child = child;
    };
    List.prototype.equiv = function(rhs) {
        return this.child.equiv(rhs.child);
    };
    return {
        Terminal: Terminal,
        List: List
    };
});