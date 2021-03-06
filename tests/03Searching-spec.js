import { Problem, Node, Queue, Stack, MaxPriorityQueue, MinPriorityQueue  } from '../03Searching/models/SearchClasses.js';
import { getActionList, getActionStateList, aStarSearch, convertSetToFunction } from '../03Searching/models/SearchFunctions.js';
import * as assert from 'assert';

describe("SearchClasses", function() {
  describe("Queue", function() {
    let q1 = new Queue();
    let q2 = new Queue();
    it("should return 0 length when new", function() {
      assert.equal(Queue.isEmpty(q1), true);
    });
    it("should use pure function when adding", function() {
      q2 = Queue.insert(4, q1);
      assert.equal(Queue.isEmpty(q1), true);
      assert.equal(Queue.isEmpty(q2), false);
    });
    it("should use non-pure function when removing in right order", function() {
      q2 = Queue.insert(4, q1);
      q2 = Queue.insert(5, q2);
      let n = Queue.pop(q2);
      assert.equal(n, 4);
      assert.equal(Queue.isEmpty(q2), false);
      n = Queue.pop(q2);
      assert.equal(n, 5);
      assert.equal(Queue.isEmpty(q2), true);
    });
  });

  describe("Stack", function() {
    it("should return 0 length when new", function() {
      let s1 = new Stack();
      assert.equal(Stack.isEmpty(s1), true);
    });
    it("should use pure function when adding", function() {
      let s1 = new Stack();
      let s2 = Stack.insert(4, s1);
      assert.equal(Stack.isEmpty(s1), true);
      assert.equal(Stack.isEmpty(s2), false);
    });
    it("should use non-pure function when removing, in right order", function() {
      let s1 = new Stack();
      let s2 = new Stack();
      s2 = Stack.insert(4, s1);
      s2 = Stack.insert(5, s2);
      let n = Stack.pop(s2);
      assert.equal(n, 5);
      assert.equal(Stack.isEmpty(s2), false);
      n = Stack.pop(s2);
      assert.equal(n, 4);
      assert.equal(Stack.isEmpty(s2), true);
    });
  });

  describe("VacuumProblemTest", function() {
    const initialState = { vacuumLocation: 'left', dirtLocations: ['left', 'right'] };

    const goalStateSet = new Set();
    goalStateSet.add({vacuumLocation: 'left', dirtLocations: []});
    goalStateSet.add({vacuumLocation: 'right', dirtLocations: []});
    const goalStateFunction = convertSetToFunction(goalStateSet);


    let actionFunction = function(state) {
      let actions = new Set();
      actions.add('left');
      actions.add('right');
      actions.add('suck');
      return actions;
    }

    let transitionFunction = function(action, state) {
      let newState = JSON.parse(JSON.stringify(state))
      switch(action) {
        case 'left':
          if (state.vacuumLocation === 'right')
            newState.vacuumLocation = 'left';
          break;
        case 'right':
          if (state.vacuumLocation === 'left')
            newState.vacuumLocation = 'right';
          break;
        case 'suck':
          if (state.vacuumLocation === 'right' && state.dirtLocations.includes('right'))
            newState.dirtLocations = newState.dirtLocations.filter((l) => { return l != 'right'; });
          else if (state.vacuumLocation === 'left' && state.dirtLocations.includes('left'))
            newState.dirtLocations = newState.dirtLocations.filter((l) => { return l != 'left'; });
          break;
      }
      return newState;
    }

    let stepCostFunction = function(state, action) {
      return 1;
    }

    let stateToStringFunction = function(node) {
      let stateString = "state: { vacuumLocation: ";
      stateString += node.state.vacuumLocation;
      stateString += ", dirtLocations: [ ";
      for (var i = 0; i <  node.state.dirtLocations.length; i++)
        stateString += node.state.dirtLocations[i] + ", ";
      if (node.state.dirtLocations.length > 0)
        stateString = stateString.slice(0, -2)
      stateString += " ] }"
      return stateString;
    }

    let vacuumWorldProblem = new Problem(initialState, goalStateFunction, actionFunction
      , transitionFunction, stepCostFunction);

    it("should create node and child node properly", function() {
      let root = new Node(initialState, null, null, 0);
      let rightNode = Node.getChildNode(vacuumWorldProblem, root, 'right');
      let suckNode = Node.getChildNode(vacuumWorldProblem, rightNode, 'suck');
      assert.equal(JSON.stringify(root.state), JSON.stringify({ vacuumLocation: 'left', dirtLocations: ['left', 'right'] }));
      assert.equal(JSON.stringify(rightNode.state), JSON.stringify({ vacuumLocation: 'right', dirtLocations: ['left', 'right'] }));
      assert.equal(JSON.stringify(suckNode.state), JSON.stringify({ vacuumLocation: 'right', dirtLocations: ['left'] }));
    });
    it("max priority queue should order Nodes by decreasing cost", function() {
      let n1 = new Node(initialState, null, null, 76);
      let n2 = new Node({vacuumLocation: 'left', dirtLocations: []}, null, null, -23);
      let n3 = new Node(initialState, null, null, 0);
      let n4 = new Node(initialState, null, null, 42);
      let n5 = new Node({vacuumLocation: 'right', dirtLocations: []}, null, null, 12);
      let n6 = new Node(initialState, null, null, 42);
      let priorityQueue = new MaxPriorityQueue();
      priorityQueue.insert(n1);
      priorityQueue.insert(n2);
      priorityQueue.insert(n3);
      priorityQueue.insert(n4);
      priorityQueue.insert(n5);
      priorityQueue.insert(n6);
      assert.equal(priorityQueue.size(), 6);
      assert.ok(priorityQueue.containsNodeState(initialState));
      assert.ok(priorityQueue.containsNodeState({vacuumLocation: 'left', dirtLocations: []}));
      assert.ok(priorityQueue.containsNodeState({vacuumLocation: 'right', dirtLocations: []}));
      assert.equal(priorityQueue.returnNodeByState(initialState).state, initialState);
      assert.equal(priorityQueue.size(), 6);
      priorityQueue.removeNodeByState({vacuumLocation: 'left', dirtLocations: []});
      assert.equal(priorityQueue.size(), 5);
      assert.ok(priorityQueue.containsNodeState(initialState));
      assert.ok(!priorityQueue.containsNodeState({vacuumLocation: 'left', dirtLocations: []}));
      assert.ok(priorityQueue.containsNodeState({vacuumLocation: 'right', dirtLocations: []}));
      assert.equal(priorityQueue.returnNodeByState(initialState).state, initialState);
      let largest = priorityQueue.extractMax().pathCost;
      while (!priorityQueue.isEmpty()) {
        let next = priorityQueue.extractMax().pathCost;
        assert.ok(largest >= next);
        largest = next;
      }
    });
    it("min priority queue should order Nodes by increasting cost", function() {
      let n1 = new Node(initialState, null, null, 76);
      let n2 = new Node({vacuumLocation: 'left', dirtLocations: []}, null, null, -23);
      let n3 = new Node(initialState, null, null, 0);
      let n4 = new Node(initialState, null, null, 42);
      let n5 = new Node({vacuumLocation: 'right', dirtLocations: []}, null, null, 12);
      let n6 = new Node(initialState, null, null, 42);
      let priorityQueue = new MinPriorityQueue();
      priorityQueue.insert(n1);
      priorityQueue.insert(n2);
      priorityQueue.insert(n3);
      priorityQueue.insert(n4);
      priorityQueue.insert(n5);
      priorityQueue.insert(n6);
      assert.equal(priorityQueue.size(), 6);
      assert.ok(priorityQueue.containsNodeState(initialState));
      assert.ok(priorityQueue.containsNodeState({vacuumLocation: 'left', dirtLocations: []}));
      assert.ok(priorityQueue.containsNodeState({vacuumLocation: 'right', dirtLocations: []}));
      assert.ok(priorityQueue.returnNodeByState(initialState).state, initialState);
      assert.equal(priorityQueue.size(), 6);
      priorityQueue.removeNodeByState({vacuumLocation: 'left', dirtLocations: []});
      assert.equal(priorityQueue.size(), 5);
      assert.ok(priorityQueue.containsNodeState(initialState));
      assert.ok(!priorityQueue.containsNodeState({vacuumLocation: 'left', dirtLocations: []}));
      assert.ok(priorityQueue.containsNodeState({vacuumLocation: 'right', dirtLocations: []}));
      assert.equal(priorityQueue.returnNodeByState(initialState).state, initialState);
      let smallest = priorityQueue.extractMin().pathCost;
      while (!priorityQueue.isEmpty()) {
        let next = priorityQueue.extractMin().pathCost;
        assert.ok(smallest <= next);
        smallest = next;
      }
    });
    it("Astar should return an answer", function() {
      let vacuumSolutionNode = aStarSearch(vacuumWorldProblem);
      let actionList = getActionList(vacuumSolutionNode);
      let fullList = getActionStateList(vacuumSolutionNode, stateToStringFunction, vacuumWorldProblem);
      assert.ok(actionList.length > 0);
      assert.ok(fullList.length > 0);
      //console.log(fullList);
    });
  });


});
