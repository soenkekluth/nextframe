import raf from 'raf';

/**
 * create a Promise that resolves in the next Animationframe
 * @param  {...} args - optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve in the next Animationframe
 */
export const nextFrame = (...args) => new Promise(resolve => raf(() => { resolve(...args); }));

/**
 * waiting x frames before the Promise will resolve
 * @param  {Number}    frame - the number of frames the Promise waits before resolving
 * @param  {...} args 	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the waiting frames
 */
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


/**
 * resolve when fn returns a truthy value.
 * @param  {Function}  fn   a function that will be called every frame to check for changes
 * @param  {...[type]} args  	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the waiting frames
 */
export const when = (fn, ...args) => {
  return nextFrame()
    .then(() => {
      const result = fn(...args);
      if (result) {
        return (args && (args.length > 1)) ? args : result;
      }
      return when(fn, ...args);
    });
};


/**
 * until fn returns a truthy value do not resolve.
 * @param  {Function}  fn   a function that will be called every frame to check for changes
 * @param  {...[type]} args  	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the waiting frames
 */
export const until = (fn, ...args) => {
  return nextFrame()
    .then(() => {
      const result = fn(...args);
      if (result) {
      	return until(fn, ...args);
      }
       return (args && (args.length > 1)) ? args : result;
    });
};


/**
 * create an animationframe loop that calls a function (callback) in every frame
 * @param  {Function} cb - gets called in every frame - for rendering mostly
 * @return {Function}  a function which cancels the initialed loop by calling it
 */
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


/**
 * create a throttled animationframe loop that calls a function (callback) in every specified
 * @param  {Function} cb        gets called in every specified frame
 * @param  {Number}   throttle in wich interval cb is called
 * @return {Function}  a function which cancels the initialed loop by calling it
 */
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

/**
 * delays the call to nextFrame with setTimeout
 * @param  {Number}    ms    delay in ms
 * @param  {...} args 	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the delayed animationframe
 */
export const delay = (ms = 0, ...args) => new Promise((resolve, reject) => setTimeout(() => {
  nextFrame()
    .then(() => resolve(...args));
}, ms));


/**
 * call a function sequencely every next frame on every iterating position of an array
 * @param  {Array}   collection keeps all values that will be used as the argument for the function
 * @param  {Function} fn         will be called with array values as aruments
 * @return {Promise} which will resolve after the sequence
 */
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
