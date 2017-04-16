const raf = require('raf');

const nextFrame = (...args) => new Promise((resolve, reject) => raf(() => { resolve(...args); }));

const delay = (ms = 0, ...args) => new Promise((resolve, reject) => setTimeout(() => {
  nextFrame().then(() => resolve(...args));
}, ms));

const sequence = (collection, fn) => {
  let chain = Promise.resolve();
  const values = [];
  collection.forEach(item => {
    chain = chain
      .then(() => nextFrame().then(() => values.push(fn(item))));
  });
  return chain.then(() => values);
}

nextFrame.delay = delay;
nextFrame.sequence = sequence;
module.exports = nextFrame;
