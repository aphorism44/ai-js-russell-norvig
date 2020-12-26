import { Problem, Node, MinPriorityQueue  } from './SearchClasses.js';

const getActionList = function(solutionNode) {
  if (solutionNode == null)
    return [];
  let node = solutionNode;
  let actionList = [];
  while (node.parent != null) {
    actionList.unshift(node.action);
    node = node.parent;
  }
  return actionList;
}

const getActionStateList = function(solutionNode, stateStringifyFunction, problem) {
  if (solutionNode == null)
    return [];
  let node = solutionNode;
  let fullList = [];
  while (node != null) {
    let nodeState = node.state;
    if (stateStringifyFunction != null)
      nodeState = stateStringifyFunction(node);
    fullList.unshift({ state: nodeState, action: node.action, currentCost: node.pathCost });
    node = node.parent;
  }
  return fullList;
}


//NOTE - if the heuristicFunction of the problem returns a constant (or doesn't exist)
//, A* is equivlaent to Uniform Cost Search
const aStarSearch = function(problem) {
    let firstNode = new Node(problem.initialState, null, null, 0, null);
    firstNode.totalHeuristicCost = firstNode.pathCost + problem.heuristicCost(firstNode.state, null);
    let frontier = new MinPriorityQueue();
    frontier.insert(firstNode);
    let explored = new Set();
    while (true) {
      if (frontier.isEmpty())
        return null;
      let node = frontier.extractMin();
      if (problem.goalTest(node.state))
        return node;
      explored.add(JSON.stringify(node.state));
      let actionSet = problem.actions(node.state);
      for (var action of actionSet) {
        let childNode = Node.getChildNode(problem, node, action);
        //console.log(childNode);
        childNode.totalHeuristicCost =  childNode.pathCost + problem.heuristicCost(childNode.state, action);
        if(!explored.has(JSON.stringify(childNode.state)) && !frontier.containsNodeState(childNode.state))
          frontier.insert(childNode);
        let existingChildNode = frontier.returnNodeByState(JSON.stringify(childNode.state));
        if (existingChildNode != null && existingChildNode.totalHeuristicCost > childNode.totalHeuristicCost) {
          frontier.removeNodeByState(existingChildNode.state);
          frontier.insert(childNode);
        }
      }
  }
}

//first-class function - converts sets to functions, since opt problems use goal functions, not sets
const convertSetToFunction = function(set) {
  let goalStateSet = new Set();
  for (var obj of set)
    goalStateSet.add(JSON.stringify(obj));
  return function(state) {
    return goalStateSet.has(state);
  }
}

export { getActionList, getActionStateList, aStarSearch, convertSetToFunction };
