import assert from 'assert';
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
  /*
  describe("8Queen Problem Annealed", function() {
    const initialState = [null,null,null,null,null,null,null,null];

    const goalFunction = function(state) {
      for (var i = 0; i < state.length; i++) {
        if (state[i] == null)
          return false;


      }
    }
  });
  */
/*
this.initialState = initialState;
this.goalStateFunction = goalStateFunction;
this.actionFunction = actionFunction;
this.transitionFunction = transitionFunction;
this.stepCostFunction = stepCostFunction;
this.heuristicFunction = heuristicFunction;
*/


});
