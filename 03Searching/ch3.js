import { Problem } from '../03Searching/models/SearchClasses.js';
import { getActionList, getActionStateList, aStarSearch } from '../03Searching/models/SearchFunctions.js';

const toyProblem8Puzzle = function() {

  console.log("calculating 8-puzzle solution...")
  //const initialState = [ [7,2,4], [5, null, 6], [8,3,1] ];
  const initialState = [ [null,1, 2], [3, 4, 5], [6,7,8] ];

  const goalStateSet = new Set();
  goalStateSet.add([ [1,null,2], [3, 4, 5], [6,7,8] ]);

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
    for (var row = 0; row < node.state.length; row++) {
      for (var col = 0; col < node.state[0].length; col++) {
        stateString += node.state[row][col] + ", "
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
  let fullList = getActionStateList(solution8Node, stateToStringFunction, problem8);
  console.log(actionList);
  console.log(fullList);

}

const problemMapTraverse = function() {
  console.log("calculating map traversal solution...");

  const initialState = 'Arad';

  const goalStateSet = new Set();
  goalStateSet.add('Bucharest');

  let actionFunction = function(state) {
    let actions = new Set();
    switch(state) {
      case 'Arad':
        actions.add('Zerind');
        actions.add('Sibiu')
        actions.add('Timisoara')
        break;
      case 'Bucharest':
        actions.add('Urziceni');
        actions.add('Giurglu')
        actions.add('Fagaras')
        break;
      case 'Craiova':
        actions.add('Drobeta');
        actions.add('Rimnicu Vilcea')
        actions.add('Pitesti')
        break;
      case 'Drobeta':
        actions.add('Craiova');
        actions.add('Mehadia')
        break;
      case 'Eforie':
        actions.add('Hirsova');
        break;
      case 'Fagaras':
        actions.add('Bucharest');
        actions.add('Sibiu')
        break;
      case 'Giurglu':
        actions.add('Bucharest');
        break;
      case 'Hirsova':
        actions.add('Eforie');
        actions.add('Urziceni')
        break;
      case 'Iasi':
        actions.add('Neamt');
        actions.add('Vaslui')
        break;
      case 'Lugoj':
        actions.add('Mehadia');
        actions.add('Timisoara')
        break;
      case 'Mehadia':
        actions.add('Drobeta');
        actions.add('Lugoj')
        break;
      case 'Neamt':
        actions.add('Iasi');
        break;
      case 'Oradea':
        actions.add('Sibiu');
        actions.add('Zerind')
        break;
      case 'Pitesti':
        actions.add('Craiova');
        actions.add('Rimnicu Vilcea')
        actions.add('Bucharest')
        break;
      case 'Rimnicu Vilcea':
        actions.add('Pitesti');
        actions.add('Craiova')
        actions.add('Sibiu')
        break;
      case 'Sibiu':
        actions.add('Fagaras');
        actions.add('Rimnicu Vilcea')
        actions.add('Arad')
        actions.add('Oradea')
        break;
      case 'Timisoara':
        actions.add('Lugoj');
        actions.add('Arad')
        break;
      case 'Urziceni':
        actions.add('Hirsova');
        actions.add('Vaslui')
        actions.add('Bucharest')
        break;
      case 'Vaslui':
        actions.add('Iasi');
        actions.add('Urziceni')
        break;
      case 'Zerind':
        actions.add('Oradea');
        actions.add('Arad')
        break;
    }
    return actions;
  }

  let transitionFunction = function(action, state) {
    //as long as action was grabbed from actionsFunction, is valid
    return action;
  }

  let stepCostFunction = function(state, action) {
    let routeCost = new Map();
    routeCost.set('Arad, Zerind', 75);
    routeCost.set('Arad, Sibiu', 140);
    routeCost.set('Arad, Timisoara', 118);
    routeCost.set('Zerind, Oradea', 71);
    routeCost.set('Oradea, Sibiu', 151);
    routeCost.set('Timisoara, Lugoj', 111);
    routeCost.set('Sibiu, Fagaras', 99);
    routeCost.set('Sibiu, Rimnicu Vilcea', 80);
    routeCost.set('Lugoj, Mehadia', 70);
    routeCost.set('Fagaras, Bucharest', 211);
    routeCost.set('Rimnicu Vilcea, Pitesti', 97);
    routeCost.set('Rimnicu Vilcea, Craiova', 146);
    routeCost.set('Mehadia, Drobeta', 75);
    routeCost.set('Bucharest, Pitesti', 101);
    routeCost.set('Bucharest, Urziceni', 85);
    routeCost.set('Bucharest, Giurglu', 90);
    routeCost.set('Pitesti, Craiova', 138);
    routeCost.set('Craiova, Drobeta', 120);
    routeCost.set('Urziceni, Hirsova', 98);
    routeCost.set('Urziceni, Vaslui', 142);
    routeCost.set('Hirsova, Eforie', 86);
    routeCost.set('Vaslui, Iasi', 92);
    routeCost.set('Iasi, Neamt', 87);
    return routeCost.get(state + ", " + action) || routeCost.get(action + ", " + state);
  }

  let stateToStringFunction = function(node) {
    return node.state;
  }

  let heuristicFunction = function(state, action) {
    let straightLineToBucharest = new Map();
    straightLineToBucharest.set('Arad', 366);
    straightLineToBucharest.set('Bucharest', 0);
    straightLineToBucharest.set('Craiova', 160);
    straightLineToBucharest.set('Drobeta', 242);
    straightLineToBucharest.set('Eforie', 161);
    straightLineToBucharest.set('Fagaras', 176);
    straightLineToBucharest.set('Giurglu', 77);
    straightLineToBucharest.set('Hirsova', 151);
    straightLineToBucharest.set('Iasi', 226);
    straightLineToBucharest.set('Lugoj', 244);
    straightLineToBucharest.set('Mehadia', 241);
    straightLineToBucharest.set('Neamt', 234);
    straightLineToBucharest.set('Oradea', 380);
    straightLineToBucharest.set('Pitesti', 100);
    straightLineToBucharest.set('Rimnicu Vilcea', 193);
    straightLineToBucharest.set('Sibiu', 253);
    straightLineToBucharest.set('Timisoara', 329);
    straightLineToBucharest.set('Urziceni', 80);
    straightLineToBucharest.set('Vaslui', 199);
    straightLineToBucharest.set('Zerind', 374);
    return straightLineToBucharest.get(state);
  }

  let problemMap = new Problem(initialState, goalStateSet, actionFunction
    , transitionFunction, stepCostFunction, heuristicFunction);

  let mapSolutionNode = aStarSearch(problemMap);
  let actionList = getActionList(mapSolutionNode);
  let fullList = getActionStateList(mapSolutionNode, stateToStringFunction, problemMap);
  console.log(actionList);
  console.log(fullList);

}

const problemMissionariesCannibals = function() {
  console.log("calculating missionaries & cannibals solution...");

  const initialState = { leftBank: {missionary: 3, cannibal: 3 }, raft: {missionary: 0, cannibal: 0 }, rightBank: {missionary: 0, cannibal: 0 }};

  const goalStateSet = new Set();
  goalStateSet.add({ leftBank: {missionary: 0, cannibal: 0 }, raft: {missionary: 0, cannibal: 0 }, rightBank: {missionary: 3, cannibal: 3 }});

  let actionFunction = function(state) {
    let actions = new Set();
    let leftBankMissionaries = state.leftBank.missionary;
    let leftBankCannibals = state.leftBank.cannibal;
    let raftMissionaries = state.raft.missionary;
    let raftCannibals = state.raft.cannibal;
    let rightBankMissionaries = state.rightBank.missionary;
    let rightBankCannibals = state.rightBank.cannibal;
    //first list all possible actions
    if (raftMissionaries + raftCannibals == 2) {
      //full raft
      actions.add('unloadMissionaryLeft');
      actions.add('unloadMissionaryRight');
      actions.add('unloadCannibalLeft');
      actions.add('unloadCannibalRight');
    } else if (raftMissionaries + raftCannibals == 1) {
      actions.add('loadLeftMissionary');
      actions.add('loadRightMissionary');
      actions.add('loadLeftCannibal');
      actions.add('loadRightCannibal');
      actions.add('unloadMissionaryLeft');
      actions.add('unloadMissionaryRight');
      actions.add('unloadCannibalLeft');
      actions.add('unloadCannibalRight');
    } else {
      //empty raft
      actions.add('loadLeftMissionary');
      actions.add('loadRightMissionary');
      actions.add('loadLeftCannibal');
      actions.add('loadRightCannibal');
    }
    //now simulate what each action might do, and remove if it results in
    //cannibals > missionaries on either bank OR if it results in negatives
    //OR if raft is too heavy
    for (var action of actions) {
      let resultingState = this.transitionFunction(action, state);
      if (resultingState.leftBank.cannibal > resultingState.leftBank.missionary)
        actions.delete(action);
      if (resultingState.rightBank.cannibal > resultingState.rightBank.missionary)
        actions.delete(action);
      if (resultingState.leftBank.cannibal < 0 || resultingState.leftBank.missionary < 0)
        actions.delete(action);
      if (resultingState.raft.cannibal < 0 || resultingState.raft.missionary < 0)
        actions.delete(action);
      if (resultingState.rightBank.cannibal < 0 || resultingState.rightBank.missionary < 0)
        actions.delete(action);
    }

    return actions;
  }

  let transitionFunction = function(action, state) {
    //as long as action was grabbed from actionsFunction, is valid
    let newState = JSON.parse(JSON.stringify(state))
    switch(action) {
      case 'loadLeftMissionary':
        newState.leftBank.missionary--;
        newState.raft.missionary++;
        break;
      case 'loadRightMissionary':
        newState.rightBank.missionary--;
        newState.raft.missionary++;
        break;
      case 'loadLeftCannibal':
        newState.leftBank.cannibal--;
        newState.raft.cannibal++;
        break;
      case 'loadRightCannibal':
        newState.rightBank.cannibal--;
        newState.raft.cannibal++;
        break;
      case 'unloadMissionaryLeft':
        newState.raft.missionary--;
        newState.leftBank.missionary++;
        break;
      case 'unloadMissionaryRight':
        newState.raft.missionary--;
        newState.rightBank.missionary++;
        break;
      case 'unloadCannibalLeft':
        newState.raft.cannibal--;
        newState.leftBank.cannibal++;
        break;
      case 'unloadCannibalRight':
        newState.raft.cannibal--;
        newState.rightBank.cannibal++;
        break;
    }

    return newState;
  }

  let stepCostFunction = function(state, action) {
    return 1;
  }

  let stateToStringFunction = function(node) {
    return JSON.stringify(node.state);
  }

  let heuristicFunction = function(state, action) {
    //people on left bank = 2 points each
    //people on raft = 1 point each
    let points = 0;
    points += (state.leftBank.cannibal + state.leftBank.missionary) * 2;
    points += state.raft.cannibal + state.raft.missionary;
    return points;
  }

  let problemCannibal = new Problem(initialState, goalStateSet, actionFunction
    , transitionFunction, stepCostFunction, heuristicFunction);

  let cannibalSolutionNode = aStarSearch(problemCannibal);
  //console.log(cannibalSolutionNode);
  let actionList = getActionList(cannibalSolutionNode);
  let fullList = getActionStateList(cannibalSolutionNode, stateToStringFunction, problemCannibal);
  //console.log(actionList);
  console.log(fullList);

}

export { toyProblem8Puzzle, problemMapTraverse, problemMissionariesCannibals };
