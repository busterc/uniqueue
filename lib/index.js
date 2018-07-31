'use strict';

module.exports = function(matcher) {
  const _matcher = matcher;
  const queued = new Set();
  const processed = new Set();

  function push(item, matcher = _matcher) {
    if (matcher) {
      let matched = [...queued].find(q => {
        return matcher(q, item);
      });
      if (matched) {
        return;
      }
    }
    queued.add(item);
  }

  function pop() {
    let item = [...queued].find(x => {
      return !processed.has(x);
    });
    if (typeof item !== 'undefined') {
      processed.add(item);
    }
    return item;
  }

  function remaining() {
    return queued.size - processed.size;
  }

  function clear() {
    queued.clear();
    processed.clear();
  }

  return {
    push,
    pop,
    remaining,
    queued,
    processed,
    clear
  };
};
