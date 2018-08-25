# uniqueue [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/busterc/uniqueue.svg)](https://greenkeeper.io/)

> only queue unique items and retrieve them only once

## Installation

```sh
$ npm install --save uniqueue
```

## Usage

```js
'use strict';

const Uniqueue = require('uniqueue');

const { push, pop, remaining, queued, processed, clear } = new Uniqueue();

const urls = [
  'https://google.com',
  'https://google.com',
  'https://google.com/',
  'https://www.google.com'
];

// Only add unique items to the queue
urls.forEach(url => {
  push(url);
});
console.log('=>', queued.size, processed.size, remaining());
// => 3 0 3

// Extract items from queue
while (remaining() > 0) {
  console.log('=> remaining:', remaining());
  console.log('=>', pop());
  console.log('=> processed:', processed.size);
  console.log();
}
// => remaining: 3
// => https://google.com
// => processed: 1
//
// => remaining: 2
// => https://google.com/
// => processed: 2
//
// => remaining: 1
// => https://www.google.com
// => processed: 3

// Clear the queue
clear();
console.log('=>', queued.size, processed.size, remaining());
// => 0 0 0

// Use a custom matcher function to prevent similar duplicates
const matcher = (a, b) => {
  return (
    a.replace(/[^a-z]/gi, '') === b.replace(/[^a-z]/gi, '') ||
    a.replace(/:\/\/www\./i, '://') === b.replace(/:\/\/www\./i, '://')
  );
};
urls.forEach(url => {
  push(url, matcher);
});
console.log('=>', [...queued]);
// => [ 'https://google.com' ]

// * Use a custom matcher function during initialization
const queue = new Uniqueue(matcher);
// ...
```

## API

### Uniqueue([matcher])

Returns a new `queue` instance.

- #### matcher

  - `Optional` : `Function` is evaluated on every attempt to add an item to the queue.

    - Overrides the default `Set` [value equality check](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Value_equality)

    - e.g. `(a, b) => a.name.toUpperCase() === b.name.toUpperCase()` will prevent `{ name: "Bob" }` from being added if `{ name: "BOB" }` is already in the queue.

### queue

`Uniqueue` instance.

- #### .push(item [, matcher])

  Adds an item of `Any` type to the queue.

  - ##### matcher

    `Optional` : `Function` overrides the `matcher` function provided during initialization (if it was provided).

- #### .pop()

  Returns the next available item from the queue or `null` if no items are available.

- #### .remaining()

  Returns the `Number` of available items from the queue.

- #### .queued

  The `Set` holding all unique items added to the queue.

- #### .processed

  The `Set` holding all items that have been `pop()`'d from the queue.

- #### .clear()

  Clears the queue, including `.queued` and `.processed`.

## License

ISC © [Buster Collings]()

[npm-image]: https://badge.fury.io/js/uniqueue.svg
[npm-url]: https://npmjs.org/package/uniqueue
[travis-image]: https://travis-ci.org/busterc/uniqueue.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/uniqueue
[daviddm-image]: https://david-dm.org/busterc/uniqueue.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/uniqueue
[coveralls-image]: https://coveralls.io/repos/busterc/uniqueue/badge.svg
[coveralls-url]: https://coveralls.io/r/busterc/uniqueue
