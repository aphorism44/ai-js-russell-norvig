import R from 'ramda';

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
  static insert(element, queue) {
    let q = new Queue();
    q.array = R.append(element, queue.array);
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
  static insert(element, stack) {
    let s = new Stack();
    s.array = R.prepend(element, stack.array);
    return s;
  }
}

class Set {
  constructor() {
    this.object = {};
  }
  static isEmpty(set) {
      return R.keys(set.object).length === 0 ? true: false;
  }
  static remove(element, set) {
    let s = new Set();
    s.object = R.dissoc(element, set.object)
    return s;
  }

  static insert(element, set) {
    let s = new Set();
    s.object = R.assoc(element, true, set.object);
    return s;
  }
}





export { Queue, Stack, Set };
