import { OptNode } from '../04BeyondClassical/models/Classes.js';

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
    let deltaE = nextNode.value - currentNode.value;
    let randomProb = Math.random();
    if (isMin) {
      if (deltaE < 0)
        currentNode  = nextNode;
      else if (Math.exp(Math.abs(deltaE) / temp) >= randomProb)
        currentNode = nextNode;
    } else {
        if (deltaE > 0)
          currentNode = nextNode;
        else if (Math.exp(deltaE / temp) >= randomProb)
          currentNode = nextNode;
    }
  }
}

const getRandomSuccessorNode(problem, node) {
  let possibleActions = Array.from(problem.actions(node.state));
  let randomAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
  return OptNode.getSuccessorNode(problem, randomAction, node.state);
}

const getAnnealTemperatureSchedule = function() {
  let schedule = {};
  let maxTemp = 1000;
  let maxTime = 10000;
  schedule[0] = maxTemp;
  for (var time = 1; time < maxTime; time++)
    schedule[time] = maxTemp * ((maxTime - time) / maxTime);
  schedule[maxTime] = 0;
  return schedule;
}

export { simulatedAnnealing, getAnnealTemperatureSchedule };
