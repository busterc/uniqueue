const assert = require('assert');
const uniqueue = require('../index.js');

describe('uniqueue', () => {
  it('only adds unique items', () => {
    const { push, queued } = uniqueue();
    [1, 1, 1].forEach(n => push(n));
    assert(queued.size === 1, 'Should only have 1 item in queue');
  });

  it('only retrieves items once', () => {
    const { push, pop, queued, remaining } = uniqueue();
    [1, 2, 3].forEach(n => push(n));
    assert(queued.size === 3, 'Should have 3 items in queue');
    let pops = 0;
    let attempts = remaining() + 3;
    while (attempts > 0) {
      attempts -= 1;
      let item = pop();
      if (typeof item !== 'undefined') {
        pops += 1;
      }
    }
    assert(pops === 3, 'Should have only retrieved 3 items from queue');
  });

  it('push() uses a custom matcher to prevent similar dupes', () => {
    const { push, queued } = uniqueue();
    let matcher = (a, b) => a.x === b.x;
    [{ x: 1 }, { x: 1 }].forEach(n => push(n, matcher));
    assert(queued.size === 1, 'Should only have 1 item in queue');
    push({ x: 1 }, a => a.y);
    assert(queued.size === 2, 'Should have added a 2nd item to the queue');
  });

  it('uses a custom matcher, provided at initialization', () => {
    let matcher = (a, b) => a.x === b.x;
    const { push, queued } = uniqueue(matcher);
    [{ x: 1 }, { x: 1 }].forEach(n => push(n));
    assert(queued.size === 1, 'Should only have 1 item in queue');
  });

  it('clears the queue (queued and processed sets)', () => {
    const { push, pop, queued, processed, clear } = uniqueue();
    [1, 2, 3].forEach(n => push(n));
    assert(queued.size === 3, 'Should have 3 items in queue');
    pop();
    assert(processed.size === 1, 'Should have processed 1 item');
    clear();
    assert(queued.size === 0, 'Should have cleared queued set');
    assert(processed.size === 0, 'Should have cleared processed set');
  });
});
