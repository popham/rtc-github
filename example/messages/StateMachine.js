define([], function () {
    /**
     * Create a finite state machine.
     * @param {String} initialState - The FSM's first state.
     * @param {Object} diagram - The state machine's diagram, e.g.
     *     {
     *         state1: {
     *             event1 : [action1, "state2"],
     *             event2 : [action2]
     *         },
     *         state2 : {
     *             event3 : [[action3, context], "state1"]
     *         }
     *     }
     * @returns StateMachine
     */
    var StateMachine = function(initialState, diagram) {
        this._state = initialState;
        this._diagram = diagram;
    };

    StateMachine.prototype.trigger = function (name, args) {
        var action = this._diagram[this._state][name];

        // Either `action[0]` is the function, or `action[0][0]` if a scope was
        // given.
        (action[0][0] || action[0]).call(action[0][1], args);

        // Toggle state if the event implies a transition.  Return the state so
        // that non-transitions yield the state for callers.
        return this._state = action[1] || this._state;
    };

    return StateMachine;
});
