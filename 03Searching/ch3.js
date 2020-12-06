import { Problem } from '../03Searching/models/SearchClasses.js';
import { getActionList, getActionStateList, aStarSearch } from '../03Searching/models/SearchFunctions.js';

const toyProblem8Puzzle = function() {

  let explored = new Set();
  console.log("calculating 8-puzzle solution...")
  const initialState = [ [7,2,4], [5, null, 6], [8,3,1] ];

  const goalStateSet = new Set();
  goalStateSet.add([ [null,1,2], [3, 4, 5], [6,7,8] ]);

  let actionFunction = function(state) {
    //denotes which tile, relative to the empty space, is moved
    //into the empty space
    let actions = new Set();
    actions.add('top');
    actions.add('left');
    actions.add('right');
    actions.add('bottom');
    //remove the actions if that tile doesn't exist
    //if blank space in top or bottom row, remove top or bottom tile options
    if (state[0].includes(null))
      actions.delete('top')
    if (state[2].includes(null))
      actions.delete('bottom')
    //if blank space in left or right column, remove left or right options
    if (state[0][0] == null || state[1][0] == null || state[2][0] == null)
      actions.delete('left')
    if (state[0][2] == null || state[1][2] == null || state[2][2] == null)
      actions.delete('right')
    return actions;
  }

  let transitionFunction = function(action, state) {
    let newState = JSON.parse(JSON.stringify(state))
    let found = false;
    switch(action) {
      case 'top':
        //check rows 2 and 3
        for (var row = 1; row < state.length; row++) {
          for (var col = 0; col < state[0].length; col++) {
            if (state[row][col] == null) {
              newState[row][col] = state[row - 1][col];
              newState[row - 1][col] = null;
              found = true;
              break;
            }
            if (found)
              break;
          }
        }
        break;
      case 'left':
        //check cols 2 and 3
        for (var col = 1; col < state[0].length; col++) {
          for (var row = 0; row < state.length; row++) {
            if (state[row][col] == null) {
              newState[row][col] = state[row][col - 1];
              newState[row][col - 1] = null;
              found = true;
              break;
            }
            if (found)
              break;
          }
        }
        break;
      case 'right':
        //check cols 1 and 2
        for (var col = 0; col < state[0].length - 1; col++) {
          for (var row = 0; row < state.length; row++) {
            if (state[row][col] == null) {
              newState[row][col] = state[row][col + 1];
              newState[row][col + 1] = null;
              found = true;
              break;
            }
            if (found)
              break;
          }
        }
        break;
      case 'bottom':
        //check rows 1 and 2
        for (var row = 0; row < state.length - 1; row++) {
          for (var col = 0; col < state[0].length; col++) {
            if (state[row][col] == null) {
              newState[row][col] = state[row + 1][col];
              newState[row + 1][col] = null;
              found = true;
              break;
            }
            if (found)
              break;
          }
        }
        break;
    }
    return newState;
  }

  let stepCostFunction = function(state, action) {
    return 1;
  }

  let stateToStringFunction = function(node) {
    let stateString = "state: { [ ";
    for (var row = 0; row < state.length; row++) {
      for (var col = 0; col < state[0].length; col++) {
        stateString += state[row][col] + ", "
      }
      stateString = stateString.slice(0, -2)
      stateString += " ], [ "
    }
    stateString += " ] }"
    return stateString;
  }

  let heuristicFunction = function(state, action) {
    //number of misplaced tiles in next state
    let misplaced = 0;
    for (var row = 0; row < state.length; row++) {
      for (var col = 0; col < state[0].length; col++) {
        if (state[row][col] != this.initialState[row][col])
          misplaced++;
      }
    }
    return misplaced;
  }

  let problem8 = new Problem(initialState, goalStateSet, actionFunction
    , transitionFunction, stepCostFunction, heuristicFunction);

  let solution8Node = aStarSearch(problem8);
  let actionList = getActionList(solution8Node);
  let fullList = getActionStateList(solution8Node, stateToStringFunction);
  console.log(actionList);
  console.log(fullList);
}

const problemMapTraverse = function() {

}

export { toyProblem8Puzzle, problemMapTraverse };
