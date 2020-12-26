import assert from 'assert';
import { OptProblem } from '../04BeyondClassical/models/Classes.js';
import { getAnnealTemperatureSchedule } from '../04BeyondClassical/models/Functions.js';


describe("SearchFunctions", function() {
  describe("TempSchedule", function() {
    let s1 = new getAnnealTemperatureSchedule();
    it("should return max temp at 0 time", function() {
      assert.equal(s1[0], 1000);
    });
    it("should return 0 temp at max time", function() {
      assert.equal(s1[10000], 0);
    });
  });

  describe("8Queen Problem Annealed", function() {
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
      return stateString;
    }

    let queen8Problem = new Problem(initialState, goalStateFunction, actionFunction
      , transitionFunction, valueFunction);


  });

});
