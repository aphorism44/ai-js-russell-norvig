import R from 'ramda';

//problem (abstract sans functions), p. 66
class Problem {
  constructor(initialState, goalStateObjectSet, actionFunction, transitionFunction, stepCostFunction, heuristicFunction) {
    this.initialState = initialState;
    this.goalStateSet = new Set();
    for (var obj of goalStateObjectSet)
      this.goalStateSet.add(JSON.stringify(obj));
    this.actionFunction = actionFunction;
    this.transitionFunction = transitionFunction;
    this.stepCostFunction = stepCostFunction;
    this.heuristicFunction = heuristicFunction;
  }
  actions(state) {
    return this.actionFunction(state);
  }
  results(action, state) {
    return this.transitionFunction(action, state);
  }
  goalTest(state) {
    return this.goalStateSet.has(JSON.stringify(state));
  }
  stepCost(state, action) {
    return this.stepCostFunction(state, action) + this.heuristicCost(state, action);
  }
  heuristicCost(state, action) {
    if (this.heuristicFunction != null)
      return this.heuristicFunction(state, action);
    return 0;
  }
}

//node object, p. 79
class Node {
  constructor(state, parent, action, pathCost) {
    this.state = state;
    this.parent = parent;
    this.action = action;
    this.pathCost = pathCost;
  }
  static getChildNode(problem, parent, action) {
    let childState = problem.results(action, parent.state);
    let newPathCost = parent.pathCost + problem.stepCost(parent.state, action);
    return new Node(childState, parent, action, newPathCost);
  }
}

//FIFO
class Queue {
  constructor() {
    this.array = [];
  }
  static isEmpty(queue) {
    return queue.array.length === 0 ? true : false;
  }
  //below changes the queue
  static pop(queue) {
    return queue.array.shift();
  }
  static insert(node, queue) {
    let q = new Queue();
    q.array = R.append(node, queue.array);
    return q;
  }
}

//LIFO
class Stack extends Queue {
  constructor() {
    super();
  }
  //below changes the queue
  static pop(stack) {
    return stack.array.shift();
  }
  static insert(node, stack) {
    let s = new Stack();
    s.array = R.prepend(node, stack.array);
    return s;
  }
}

//this is not "pure" at all (except for index methods)
//uses Node as described above
//orders by smallest to largest (will be using cost)
//uses a "minHeap" structure for speed
class MaxPriorityQueue {
  constructor() {
    this.heap = [];
  }
  isEmpty() {
    return this.heap.length < 1;
  }
  size() {
    return this.heap.length;
  }
  swap(index1, index2) {
    const tmp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = tmp;
  }
  peek() {
    return this.heap[0];
  }
  insert(node) {
    // push element to the end of the heap
    this.heap.push(node);
    // the index of the element we have just pushed
    let index = this.heap.length - 1;
    // if the element is greater than its parent:
    // swap element with its parent
    while (index !== 0 && this.heap[index].pathCost > this.heap[this.getParentIndex(index)].pathCost) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }
  extractMax() {
    // remove the first element from the heap
    const root = this.heap.shift();
    // put the last element to the front of the heap
    // and remove the last element from the heap as it now
    // sits at the front of the heap
    this.heap.unshift(this.heap[this.heap.length - 1]);
    this.heap.pop();
    // correctly re-position heap
    this.heapify(0);
    return root;
  }
  heapify(index) {
    let left = this.getLeftChildIndex(index);
    let right = this.getRightChildIndex(index);
    let smallest = index;
    // if the left child is bigger than the node we are looking at
    if (left < this.heap.length && this.heap[smallest].pathCost < this.heap[left].pathCost) {
      smallest = left;
    }
    // if the right child is bigger than the node we are looking at
    if (right < this.heap.length && this.heap[smallest].pathCost < this.heap[right].pathCost) {
      smallest = right;
    }
    // if the value of smallest has changed, then some swapping needs to be done
    // and this method needs to be called again with the swapped element
    if (smallest != index) {
      this.swap(smallest, index);
      this.heapify(smallest);
    }
  }
  containsNodeState(state) {
    for (var i = 0; i < this.heap.length; i++)
      if (JSON.stringify(this.heap[i].state) == JSON.stringify(state))
        return true;
    return false;
  }
  returnNodeByState(state) {
    for (var i = 0; i < this.heap.length; i++)
      if (JSON.stringify(this.heap[i].state) == JSON.stringify(state))
        return this.heap[i];
    return null;
  }
  removeNodeByState(state) {
    for (var i = 0; i < this.heap.length; i++)
      if (JSON.stringify(this.heap[i].state) == JSON.stringify(state)) {
        let deleteNode = this.heap[i].state;
        this.heap.splice(i, 1);
        this.heapify(i);
        return deleteNode;
      }
    return null;
  }
  getLeftChildIndex(index) {
    return index * 2 + 1;
  }
  getRightChildIndex(index) {
    return index * 2 + 2;
  }
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
}

class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }
  isEmpty() {
    return this.heap.length < 1;
  }
  size() {
    return this.heap.length;
  }
  swap(index1, index2) {
    const tmp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = tmp;
  }
  peek() {
    return this.heap[0];
  }
  insert(node) {
    // push element to the end of the heap
    this.heap.push(node);
    // the index of the element we have just pushed
    let index = this.heap.length - 1;
    // if the element is smaller than its parent:
    // swap element with its parent
    while (index !== 0 && this.heap[index].pathCost < this.heap[this.getParentIndex(index)].pathCost) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }
  extractMin() {
    // remove the first element from the heap
    const root = this.heap.shift();
    // put the last element to the front of the heap
    // and remove the last element from the heap as it now
    // sits at the front of the heap
    this.heap.unshift(this.heap[this.heap.length - 1]);
    this.heap.pop();
    // correctly re-position heap
    this.heapify(0);
    return root;
  }
  heapify(index) {
    let left = this.getLeftChildIndex(index);
    let right = this.getRightChildIndex(index);
    let smallest = index;
    // if the left child is smaller than the node we are looking at
    if (left < this.heap.length && this.heap[smallest].pathCost > this.heap[left].pathCost) {
      smallest = left;
    }
    // if the right child is smaller than the node we are looking at
    if (right < this.heap.length && this.heap[smallest].pathCost > this.heap[right].pathCost) {
      smallest = right;
    }
    // if the value of smallest has changed, then some swapping needs to be done
    // and this method needs to be called again with the swapped element
    if (smallest != index) {
      this.swap(smallest, index);
      this.heapify(smallest);
    }
  }
  containsNodeState(state) {
    for (var i = 0; i < this.heap.length; i++)
      if (JSON.stringify(this.heap[i].state) == JSON.stringify(state))
        return true;
    return false;
  }
  returnNodeByState(state) {
    for (var i = 0; i < this.heap.length; i++)
      if (JSON.stringify(this.heap[i].state) == JSON.stringify(state))
        return this.heap[i];
    return null;
  }
  removeNodeByState(state) {
    for (var i = 0; i < this.heap.length; i++)
      if (JSON.stringify(this.heap[i].state) == JSON.stringify(state)) {
        let deleteNode = this.heap[i].state;
        this.heap.splice(i, 1);
        this.heapify(i);
        return deleteNode;
      }
    return null;
  }
  getLeftChildIndex(index) {
    return index * 2 + 1;
  }
  getRightChildIndex(index) {
    return index * 2 + 2;
  }
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
}



export { Problem, Node, Queue, Stack, MaxPriorityQueue, MinPriorityQueue };
