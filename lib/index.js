'use strict';

exports.__esModule = true;
var raf = require('raf');

var nextFrame = exports.nextFrame = function nextFrame() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve) {
    return raf(function () {
      resolve.apply(undefined, args);
    });
  });
};

var waitFrames = exports.waitFrames = function waitFrames() {
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

var when = exports.when = function when(fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return nextFrame().then(function () {
    var result = fn.apply(undefined, args);
    if (result === true) {
      return result;
    }
    return when(fn, result);
  });
};

var loop = exports.loop = function loop(cb) {
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

var throttleFrames = exports.throttleFrames = function throttleFrames(cb) {
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

var delay = exports.delay = function delay() {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
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

var sequence = exports.sequence = function sequence(collection, fn) {
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

exports.frameSequence = sequence;
exports.wait = waitFrames;
exports.nextFrames = loop;
exports.onEnterFrame = loop;
exports.throttle = throttleFrames;
exports.frame = nextFrame;
exports.default = nextFrame;