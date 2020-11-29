import { Problem, Node, MinPriorityQueue  } from './SearchClasses.js';

//NOTE - if the stepCost of the problem is constant, A* is equivlaent to Uniform Cost Search
class AstarSearch = {
  constructor(problem) {
    let firstNode = new Node(problem.initialStatt, null, null, 0);
    this.frontier = new MinPriorityQueue();
    this.frontier.insert(firstNode);
    this.explored = new Set();
    this.problem = problem;
  }
  solve() {
      if (this.frontier.isEmpty)
        return [];
      let node = this.frontier.extractMin();
      if (this.problem.goalTest(node.state))
        return []; //???
      this.explored.add(node.state);
      let actionSet = problem.actions(node.state);
      for (var action of actionSet) {
        let childNode = Node.getChildNode(problem, node, action);
        if(!this.explored.has(childNode.state) && !this.frontier.containsNodeState(childNode.state))
          this.frontier.insert(childNode);
        let existingChildNode = this.frontier.returnNodeByState(childNode.state);
        if (existingChildNode.pathCost > childNode.pathCost) {
          this.frontier.removeNodeByState(existingChildNode.state);
          this.frontier.insert(childNode);
        }
      }
  }
}

export { AstarSearch };
