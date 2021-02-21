import { OptNode } from './Classes.js';
import * as util from 'util';

//optional boolean "isMin" means we're looking for a
//minimum value, not maximum
const simulatedAnnealing = function(problem, tempSchedule, isMin) {
  let currentNode = new OptNode(problem.initialState, problem);
  let time = 0;
  while (true) {
    let temp =tempSchedule[time];
    if (temp == 0)
      return currentNode;
    let nextNode = getRandomSuccessorNode(problem, currentNode);
    let randomProb = Math.random();
    if (isMin) {
      let deltaE = nextNode.value - currentNode.value;
      if (deltaE > 0)
        currentNode  = nextNode;
      else if (randomProb < Math.exp(deltaE / temp))
        currentNode = nextNode;
    } else {
      let deltaE = currentNode.value - nextNode.value;
        if (deltaE > 0)
          currentNode = nextNode;
        else if (randomProb < Math.exp(deltaE / temp))
          currentNode = nextNode;
    }
    time++;
  }
}

const getRandomSuccessorNode = function(problem, node) {
  let possibleActions = Array.from(problem.actions(node.state));
  let randomAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
  return OptNode.getSuccessorNode(problem, randomAction, node.state);
}

const getAnnealTemperatureSchedule = function() {
  let schedule = {};
  let maxTemp = 500;
  let maxTime = 2000000;
  schedule[0] = maxTemp;
  for (var time = 1; time < maxTime; time++)
    schedule[time] = maxTemp * ((maxTime - time) / maxTime);
  schedule[maxTime] = 0;
  return schedule;
}

//recursive, depth-first
//returns a "plan", or array of actions that always succeeds
//"path" = hash of states parallel to actions
//NOTE - both arrays are backwards
//null = FAILURE
const andOrGraphSearch = function(problem) {
  return orSearch(problem.initialState, problem, []).reverse();
}

const orSearch = function(state, problem, path) {
  if (problem.goalTest(state))
    return [];
  if (path.includes(JSON.stringify(state)))
    return null;

  for (var action of problem.actions(state)) {
    let tempPath = Array.from(path);
    tempPath.unshift(JSON.stringify(state));
    let plan = andSearch(problem.results(action, state), problem, tempPath);
    if (plan != null) {
      console.log(action);
      console.log(plan);
      return plan.concat(action);
    }
  }
  return null;
}

const andSearch = function(stateSet, problem, path) {
  //NOTE - pseudocode is VERY unclear here, but it's meant
  //to return a single plan (or action : state) for the states
  // that return a non-null from orSearch
  for (var state of stateSet) {
    let plan = orSearch(state, problem, path);
    if (plan == null)
      return null;
    else {
      return plan;
    }
  }
}

const getNodePrintable = function(node, stateStringifyFunction) {
  if (node == null)
    return null;
  if (stateStringifyFunction != null)
    return stateStringifyFunction(node);
  return JSON.stringify(node);
}

export { simulatedAnnealing, getRandomSuccessorNode, getAnnealTemperatureSchedule, getNodePrintable, andOrGraphSearch };
