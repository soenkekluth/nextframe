const raf = require('raf');
const prs = require('prs');

const nextFrame = (...args) => prs((resolve, reject) => raf(() => { resolve(...args); }));

export const delay = (ms = 0, ...args) => prs((resolve, reject) => setTimeout(() => {
  nextFrame().then(() => resolve(...args));
}, ms));

export const sequence = (collection, fn) => {
  let chain = Promise.resolve();
  const values = [];
  collection.forEach(item => {
    chain = chain
      .then(() => nextFrame().then(() => values.push(fn(item))));
  });
  return chain.then(() => values);
}

export {nextFrame as nextFrame};
export default nextFrame;
