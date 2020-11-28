import assert from 'assert';
import { Queue, Stack, Set  } from '../03Searching/models/SearchClasses.js';
import R from 'ramda';

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

  describe("Set", function() {
    it("should return 0 length when new", function() {
      let s1 = new Set();
      assert.equal(Set.isEmpty(s1), true);
    });
    it("should use pure function when adding", function() {
      let s1 = new Set();
      let s2 = Set.insert(4, s1);
      assert.equal(Set.isEmpty(s1), true);
      assert.equal(Set.isEmpty(s2), false);
    });
    it("should use pure function when removing", function() {
      let s1 = new Set();
      let s2 = Set.insert(4, s1);
      s2 = Set.insert(5, s2);
      let s3 = Set.remove(4, s2);
      s3 = Set.remove(5, s3);
      assert.equal(Set.isEmpty(s2), false);
      assert.equal(Set.isEmpty(s3), true);
    });
  });

});
