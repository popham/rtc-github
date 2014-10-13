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
     * @returns StateMachine
     */
    var StateMachine = function(initialState, diagram) {
        this._state = initialState;
        this._diagram = diagram;

        if (diagram[initialState] === undefined)
            throw new Error("Invalid initial state");
    };

    StateMachine.prototype.trigger = function (name, args) {
        var action = this._diagram[this._state][name];

        if (action === undefined) {
            var transition = this._state + " --" + name + "("+args+")" + "--> " + name;
            throw new Error("Forbidden state transition: " + transition);
        }

        // Toggle state if the event implies a transition.  Return the state so
        // that non-transitions yield the state for callers.
        var nextState = action[1] || this._state;

        if (this._diagram[nextState] === undefined)
            throw new Error("Invalid target state: " + nextState);

        // Either `action[0]` is the function, or `action[0][0]` if a scope was
        // given.
        (action[0][0] || action[0]).apply(action[0][1], args);

        return this._state = nextState;
    };

    return StateMachine;
});
