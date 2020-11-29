import { Problem, Node, MinPriorityQueue  } from './SearchClasses.js';

//NOTE - if the stepCost of the problem is constant, A* is equivlaent to Uniform Cost Search
class AStarSearch {
  constructor(problem) {
    let firstNode = new Node(problem.initialState, null, null, 0);
    this.frontier = new MinPriorityQueue();
    this.frontier.insert(firstNode);
    this.explored = new Set();
    this.problem = problem;
  }
  solve() {
      while (true) {
        if (this.frontier.isEmpty())
          return null;
        let node = this.frontier.extractMin();
        if (this.problem.goalTest(node.state))
          return node;
        this.explored.add(JSON.stringify(node.state));
        let actionSet = this.problem.actions(node.state);
        for (var action of actionSet) {
          let childNode = Node.getChildNode(this.problem, node, action);
          if(!this.explored.has(JSON.stringify(childNode.state)) && !this.frontier.containsNodeState(childNode.state))
            this.frontier.insert(childNode);
          let existingChildNode = this.frontier.returnNodeByState(childNode.state);
          if (existingChildNode != null && existingChildNode.pathCost > childNode.pathCost) {
            this.frontier.removeNodeByState(existingChildNode.state);
            this.frontier.insert(childNode);
          }
        }
    }
  }
}

export { AStarSearch };
