
const simulatedAnnealing = function(problem, tempSchedule) {
  /*  let currentNode = makeNode(problem.initialState);
    let t = 1;
    while (true) {
      let t =tempSchedule[t];
      if (t == 0)
        return currentNode;
       let nextNode =
    }*/
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
