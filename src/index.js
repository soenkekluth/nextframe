const raf = require('raf');

export const nextFrame = (...args) => new Promise(resolve => raf(() => { resolve(...args); }));

export const waitFrames = (frame = 1, ...args) => new Promise((resolve) => {
  let i = 0;
  const count = () => {
    if (++i >= frame) {
      return resolve(frame, ...args);
    }
    raf(count);
  }
  raf(count);
});

export const loop = (cb) => {
  if (typeof cb !== 'function') {
    throw 'callback needs to be a function';
  }
  let f = true;
  const frame = () => {
    if (f) {
      cb();
      raf(frame);
    }
  }
  raf(frame);
  return () => {
    f = false;
  };
};

export const throttleFrames = (cb, throttle = 0) => {
  if (typeof cb !== 'function') {
    throw 'callback needs to be a function';
  }
  let f = true;
  let i = 0;
  const frame = () => {
    ++i;
    if (f) {
      if (throttle && (i % throttle === 0)) {
        cb();
      }
      raf(frame);
    }
  }
  raf(frame);
  return () => {
    f = false;
  };
};

export const delay = (ms = 0, ...args) => new Promise((resolve, reject) => setTimeout(() => {
  nextFrame()
  	.then(() => resolve(...args));
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

export { sequence as frameSequence }
export { waitFrames as wait }
export { loop as nextFrames }
export { loop as onEnterFrame }
export { throttleFrames as throttle }
export { nextFrame as frame }
export default nextFrame;
