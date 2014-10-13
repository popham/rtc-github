define([], function () {
    /**
     * Create a finite state machine.
     * @param {String} initialState - The FSM's first state.
     * @param {Object} diagram - The state machine's diagram, e.g.
     *     {
     *         state1: {
     *             action1 : [someFn1, "state2"],
     *             action2 : [someFn2]
     *         },
     *         state2 : {
     *             action3 : [[someFn3, context], "state1"]
     *         }
     *     }
     */
    var StateMachine = function(initialState, diagram) {
        this._state = initialState;
        this._diagram = diagram;
        this._queue = [];

        if (diagram[initialState] === undefined)
            throw new Error("Invalid initial state");
    };

    var transition = function (name, args) {
        var transition = this._state + " --" + name + "("+args+")" + "--> " + name;
        var action = this._diagram[this._state][name];

        if (action === undefined) {
            throw new Error("Forbidden state transition: " + transition);
        }

        // Toggle state if the event implies a transition.
        var nextState = action[1] || this._state;

        if (this._diagram[nextState] === undefined)
            throw new Error("Invalid target state: " + nextState);

        // `action[0]` is the function, unless a scope was provided--then the
        // function is `action[0][0]`.
        var done = function (e) {
            if (e) {
                console.warn('Failed state transition: ' + transition);
            } else {
                this._state = nextState;
                this._nextTick();
            }
        }.bind(this);

        var doneTailedArgs = args.slice();
        doneTailedArgs.push(done);

        (action[0][0] || action[0]).apply(action[0][1], doneTailedArgs);
    };

    StateMachine.prototype._nextTick = function () {
        if (this._queue.length > 0) {
            transition.apply(this, this._queue.shift());
        }
    };

    StateMachine.prototype.trigger = function (name, args) {
        this._queue.push([name, args]);
        this._nextTick();
    };

    return StateMachine;
});
