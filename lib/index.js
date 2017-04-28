'use strict';

exports.__esModule = true;
var raf = require('raf');
var prs = require('prs');

var nextFrame = exports.nextFrame = function nextFrame() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return prs(function (resolve) {
    return raf(function () {
      resolve.apply(undefined, args);
    });
  });
};

var nextFrames = exports.nextFrames = function nextFrames(cb) {
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

var delay = exports.delay = function delay() {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return prs(function (resolve, reject) {
    return setTimeout(function () {
      nextFrame().then(function () {
        return resolve.apply(undefined, args);
      });
    }, ms);
  });
};

var sequence = exports.sequence = function sequence(collection, fn) {
  var chain = prs.resolve();
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

exports.default = nextFrame;