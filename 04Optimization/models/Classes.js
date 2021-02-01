//optimization node, hinted at on p. 126
class OptNode {
  constructor(state, problem) {
    this.state = state;
    this.value = problem.value(this.state);
  }
  static getSuccessorNode(problem, action, state) {
    let successorState = problem.results(action, state);
    return new OptNode(successorState, problem);
  }
}

class OptProblem {
  constructor(initialState, goalStateFunction, actionFunction
    , transitionFunction, valueFunction) {
    this.initialState = initialState;
    this.goalStateFunction = goalStateFunction;
    this.actionFunction = actionFunction;
    this.transitionFunction = transitionFunction;
    this.valueFunction = valueFunction;
  }
  actions(state) {
    return this.actionFunction(state);
  }
  results(action, state) {
    return this.transitionFunction(action, state);
  }
  goalTest(state) {
    return this.goalStateFunction(JSON.stringify(state));
  }
  value(state) {
    return this.valueFunction(state);
  }

}

export { OptNode, OptProblem };
