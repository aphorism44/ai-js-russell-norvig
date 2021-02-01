import { OptNode } from './Classes.js';

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

const getNodePrintable = function(node, stateStringifyFunction) {
  if (node == null)
    return null;
  if (stateStringifyFunction != null)
    return stateStringifyFunction(node);
  return JSON.stringify(node);
}

export { simulatedAnnealing, getRandomSuccessorNode, getAnnealTemperatureSchedule, getNodePrintable };
