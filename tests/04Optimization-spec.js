import * as assert from 'assert';
import { OptProblem } from '../04Optimization/models/Classes.js';
import { simulatedAnnealing, getAnnealTemperatureSchedule, getNodePrintable, andOrGraphSearch } from '../04Optimization/models/Functions.js';
import { convertSetToFunction } from '../03Searching/models/SearchFunctions.js';
import * as util from 'util';

describe("SearchFunctions", function() {
  describe("TempSchedule", function() {
    let s1 = new getAnnealTemperatureSchedule();
    it("should return max temp at 0 time", function() {
      assert.equal(s1[0], 500);
    });
    it("should return 0 temp at max time", function() {
      assert.equal(s1[2000000], 0);
    });
  });

  describe("8Queen Problem Annealed returns correct answer", function() {
    const initialState = [null,null,null,null,null,null,null,null];

    const goalStateFunction = function(state) {
      let occupiedRows = new Set();
      for (var i = 0; i < state.length; i++) {
        let row = state[i];
        //check for empty columns or queens in same column
        if (row == null)
          return false;
        if (occupiedRows.has(row))
          return false;
        occupiedRows.add(row);
        //check for diagonal collisions
        let col  = i;
        let r = row;
        let displacement = 0;
        //check to the right
        for (var c = col; c < 8; c++) {
          displacement++;
          if (r + displacement < 8 && state[col + displacement] == (r + displacement))
            return false;
          if (r - displacement > -1 && state[col + displacement] == (r - displacement))
            return false;
        }
        //check to the left
        col  = i;
        r = row;
        displacement = 0;
        for (var c = col; c > -1; c--) {
          displacement++;
          if (r - displacement < 8 && state[col - displacement] == (r + displacement))
            return false;
          if (r - displacement > -1 && state[col - displacement] == (r - displacement))
            return false;
        }
      }
      return true;
    }

    //actions will be array of 2-object arrays [col, row] where you can place queen
    //, which is all blank spots
    const actionFunction = function(state) {
      let actions = new Set();
      for (var col = 0; col < state.length; col++) {
        for (var row = 0; row < state.length; row++) {
            if (state[col] == row)
              continue;
            actions.add([col, row]);
        }
      }
      return actions;
    }

    //action = [col, row]
    const transitionFunction = function(action, state) {
      let newState = JSON.parse(JSON.stringify(state))
      newState[action[0]] = action[1];
      return newState;
    }

    //this is like the goalStateFunction, but has to iterate whole board
    //and return the number of hits
    const valueFunction = function(state) {
      let hits = 0;
      for (var i = 0; i < state.length; i++) {
        let row = state[i];
        //no queen = add some hits since incomplete is bad
        if (row == null) {
          hits += 4;
          continue;
        }
        //check for queens in same row
        for (var c = 0; c < state.length; c++) {
          if (c == i)
            continue;
          if (state[c] == row)
            hits++;
        }
        //check for diagonal collisions
        let col  = i;
        let r = row;
        let displacement = 0;
        //check to the right
        for (var c = col; c < 8; c++) {
          displacement++;
          if (r + displacement < 8 && state[col + displacement] == (r + displacement))
            hits++;;
          if (r - displacement > -1 && state[col + displacement] == (r - displacement))
            hits++;;
        }
        //check to the left
        col  = i;
        r = row;
        displacement = 0;
        for (var c = col; c > -1; c--) {
          displacement++;
          if (r - displacement < 8 && state[col - displacement] == (r + displacement))
            hits++;;
          if (r - displacement > -1 && state[col - displacement] == (r - displacement))
            hits++;;
        }
      }
      return hits;
    }

    //turn 1D array into 2D chessboard for quick verification
    let stateToStringFunction = function(node) {
      let boardArray = node;//.state;
      let stateString = "state: { board: \n";
      stateString += "--------\n";
      for (var row = 0; row < boardArray.length; row++) {
        for (var col = 0; col < boardArray.length; col++) {
          if (boardArray[col] == row)
            stateString +=  "|X";
          else
            stateString += "| ";
        }
        stateString += "|\n";
      }
      stateString += "}"
      return stateString;
    }

    let queen8Problem = new OptProblem(initialState, goalStateFunction, actionFunction
      , transitionFunction, valueFunction, stateToStringFunction);
      /*
    let queen8SolutionNode = simulatedAnnealing(queen8Problem, getAnnealTemperatureSchedule(), false);
    console.log(queen8SolutionNode);
    console.log(getNodePrintable(queen8SolutionNode.state, stateToStringFunction));
    it("should solve the 8 queen problem", function() {
      assert(queen8SolutionNode.value == 0)
    });
*/
  });

  describe("Vacuum World AndOr Tree returns correct answer for ND environment", function() {
    const initialState = { vacuumLocation: 'left', dirtLocations: ['left', 'right'] };

    const goalStateSet = new Set();
    goalStateSet.add({vacuumLocation: 'left', dirtLocations: []});
    goalStateSet.add({vacuumLocation: 'right', dirtLocations: []});
    const goalStateFunction = convertSetToFunction(goalStateSet);

    //NOTE - action function can't return result of the same
    let actionFunction = function(state) {
      let actions = new Set();
      if (state.vacuumLocation != 'left')
        actions.add('left');
      if (state.vacuumLocation != 'right')
        actions.add('right');
      actions.add('suck');
      return actions;
    }

    //difference - in non-deterministic setting, transitionFunction
    //returns set of possible resulting states
    //in Vacuum world:
    // 1. During SUCK action, the following results are possible:
    //   a. Remove dirt in current square
    //   b. Remove dirt in both squares
    //   c. Drop dirt in current square
    let transitionFunction = function(action, state) {
      let newState = JSON.parse(JSON.stringify(state));
      let newStateSet = new Set();
      switch(action) {
        case 'left':
          newState.vacuumLocation = 'left';
          newStateSet.add(newState);
          break;
        case 'right':
          newState.vacuumLocation = 'right';
          newStateSet.add(newState);
          break;
        case 'suck':
          let newState2 = JSON.parse(JSON.stringify(state));
          let newState3 = JSON.parse(JSON.stringify(state));
          //normal action
          if (state.vacuumLocation === 'right' && state.dirtLocations.includes('right'))
            newState.dirtLocations = newState.dirtLocations.filter((l) => { return l != 'right'; });
          else if (state.vacuumLocation === 'left' && state.dirtLocations.includes('left'))
            newState.dirtLocations = newState.dirtLocations.filter((l) => { return l != 'left'; });
          newStateSet.add(newState);
          //hits both squares
          newState2.dirtLocations = [];
          newStateSet.add(newState2);
          //drops dirt in current square
          if (state.vacuumLocation === 'right' && !state.dirtLocations.includes('right')) {
            newState3.dirtLocations.push('right');
            newStateSet.add(newState3);
          } else if (state.vacuumLocation === 'left' && !state.dirtLocations.includes('left')) {
            newState3.dirtLocations.push('left');
            newStateSet.add(newState3);
          }
          break;
      }
      return newStateSet;
    }

    let valueFunction = function(state, action) {
      return 1;
    }

    let stateToStringFunction = function(node) {
      let stateString = "state: { vacuumLocation: ";
      stateString += node.state.vacuumLocation;
      stateString += ", dirtLocations: [ ";
      for (var i = 0; i <  node.state.dirtLocations.length; i++)
        stateString += node.state.dirtLocations[i] + ", ";
      if (node.state.dirtLocations.length > 0)
        stateString = stateString.slice(0, -2)
      stateString += " ] }"
      return stateString;
    }

    let nonDeterministicVacuumProblem = new OptProblem(initialState, goalStateFunction, actionFunction
      , transitionFunction, valueFunction);

    let NDVacuumPlan = andOrGraphSearch(nonDeterministicVacuumProblem);
    console.log(NDVacuumPlan);

    it("should solve the ND vacuum world", function() {
        assert.ok(NDVacuumPlan != null)
    });
  });

});
