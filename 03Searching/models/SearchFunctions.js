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

const getActionStateList = function(solutionNode, stateStringifyFunction) {
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
    let firstNode = new Node(problem.initialState, null, null, problem.heuristicCost(problem.initialState), null);
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
        if(!explored.has(JSON.stringify(childNode.state)) && !frontier.containsNodeState(childNode.state))
          frontier.insert(childNode);
        let existingChildNode = frontier.returnNodeByState(JSON.stringify(childNode.state));
        if (existingChildNode != null && existingChildNode.pathCost > childNode.pathCost) {
          frontier.removeNodeByState(existingChildNode.state);
          frontier.insert(childNode);
        }
      }
  }
}

export { getActionList, getActionStateList, aStarSearch };
