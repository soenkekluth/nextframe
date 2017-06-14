(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('raf')) :
	typeof define === 'function' && define.amd ? define(['exports', 'raf'], factory) :
	(factory((global.nextframe = global.nextframe || {}),global.raf));
}(this, (function (exports,raf) {

raf = raf && 'default' in raf ? raf['default'] : raf;

/**
 * create a Promise that resolves in the next Animationframe
 * @param  {...} args - optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve in the next Animationframe
 */
var nextFrame = function nextFrame() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve) {
    return raf(function () {
      resolve.apply(undefined, args);
    });
  });
};

/**
 * waiting x frames before the Promise will resolve
 * @param  {Number}    frame - the number of frames the Promise waits before resolving
 * @param  {...} args 	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the waiting frames
 */
var waitFrames = function waitFrames() {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var frame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return new Promise(function (resolve) {
    var i = 0;
    var count = function count() {
      if (++i >= frame) {
        return resolve.apply(undefined, [frame].concat(args));
      }
      raf(count);
    };
    raf(count);
  });
};

/**
 * resolve when fn returns a truthy value.
 * @param  {Function}  fn   a function that will be called every frame to check for changes
 * @param  {...[type]} args  	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the waiting frames
 */
var when = function when(fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return nextFrame().then(function () {
    var result = fn.apply(undefined, args);
    if (result) {
      return args && args.length > 1 ? args : result;
    }
    return when.apply(undefined, [fn].concat(args));
  });
};

/**
 * until fn returns a truthy value do not resolve.
 * @param  {Function}  fn   a function that will be called every frame to check for changes
 * @param  {...[type]} args  	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the waiting frames
 */
var until = function until(fn) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return nextFrame().then(function () {
    var result = fn.apply(undefined, args);
    if (result) {
      return until.apply(undefined, [fn].concat(args));
    }
    return args && args.length > 1 ? args : result;
  });
};

/**
 * create an animationframe loop that calls a function (callback) in every frame
 * @param  {Function} cb - gets called in every frame - for rendering mostly
 * @return {Function}  a function which cancels the initialed loop by calling it
 */
var loop = function loop(cb) {
  if (typeof cb !== 'function') {
    throw 'callback needs to be a function';
  }
  var f = true;
  var frame = function frame() {
    if (f) {
      cb();
      raf(frame);
    }
  };
  raf(frame);
  return function () {
    f = false;
  };
};

/**
 * create a throttled animationframe loop that calls a function (callback) in every specified
 * @param  {Function} cb        gets called in every specified frame
 * @param  {Number}   throttle in wich interval cb is called
 * @return {Function}  a function which cancels the initialed loop by calling it
 */
var throttleFrames = function throttleFrames(cb) {
  var throttle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (typeof cb !== 'function') {
    throw 'callback needs to be a function';
  }
  var f = true;
  var i = 0;
  var frame = function frame() {
    ++i;
    if (f) {
      if (throttle && i % throttle === 0) {
        cb();
      }
      raf(frame);
    }
  };
  raf(frame);
  return function () {
    f = false;
  };
};

/**
 * delays the call to nextFrame with setTimeout
 * @param  {Number}    ms    delay in ms
 * @param  {...} args 	- optional values that would be the params of the Promises resolve
 * @return {Promise} which will resolve after the delayed animationframe
 */
var delay = function delay() {
  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (resolve, reject) {
    return setTimeout(function () {
      nextFrame().then(function () {
        return resolve.apply(undefined, args);
      });
    }, ms);
  });
};

/**
 * call a function sequencely every next frame on every iterating position of an array
 * @param  {Array}   collection keeps all values that will be used as the argument for the function
 * @param  {Function} fn         will be called with array values as aruments
 * @return {Promise} which will resolve after the sequence
 */
var sequence = function sequence(collection, fn) {
  var chain = Promise.resolve();
  var values = [];
  collection.forEach(function (item) {
    chain = chain.then(function () {
      return nextFrame().then(function () {
        return values.push(fn(item));
      });
    });
  });
  return chain.then(function () {
    return values;
  });
};

exports.nextFrame = nextFrame;
exports.waitFrames = waitFrames;
exports.when = when;
exports.until = until;
exports.loop = loop;
exports.throttleFrames = throttleFrames;
exports.delay = delay;
exports.sequence = sequence;
exports.frameSequence = sequence;
exports.wait = waitFrames;
exports.nextFrames = loop;
exports.onEnterFrame = loop;
exports.throttle = throttleFrames;
exports.frame = nextFrame;
exports['default'] = nextFrame;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=nextframe.js.map
