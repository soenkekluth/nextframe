Object.defineProperty(exports, '__esModule', { value: true });

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var performanceNow = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(commonjsGlobal);

//# sourceMappingURL=performance-now.js.map
});

var root = typeof window === 'undefined' ? commonjsGlobal : window;
var vendors = ['moz', 'webkit'];
var suffix = 'AnimationFrame';
var raf = root['request' + suffix];
var caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix];
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix];
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60;

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = performanceNow()
        , next = Math.max(0, frameDuration - (_now - last));
      last = next + _now;
      setTimeout(function() {
        var cp = queue.slice(0);
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0;
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last);
            } catch(e) {
              setTimeout(function() { throw e }, 0);
            }
          }
        }
      }, Math.round(next));
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    });
    return id
  };

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true;
      }
    }
  };
}

var raf_1 = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
};
var cancel = function() {
  caf.apply(root, arguments);
};
var polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf;
  object.cancelAnimationFrame = caf;
};

raf_1.cancel = cancel;
raf_1.polyfill = polyfill;

function frame$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve) {
    return raf_1(function () {
      return resolve.apply(undefined, args);
    });
  });
}

function delay() {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return new Promise(function (resolve) {
    return setTimeout(function () {
      raf_1(function () {
        return resolve.apply(undefined, args);
      });
    }, ms);
  });
}

function loop(cb) {
  if (typeof cb !== 'function') {
    throw new Error('callback needs to be a function');
  }
  var f = true;
  var frame = function frame() {
    if (f) {
      cb();
      raf_1(frame);
    }
  };

  raf_1(frame);
  return function () {
    f = false;
  };
}

function nextFrame() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve) {
    return raf_1(function () {
      return resolve.apply(undefined, args);
    });
  });
}

function sequence(collection, fn) {
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
}

function wait() {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var frame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  return new Promise(function (resolve) {
    var i = 0;
    var count = function count() {
      if (++i >= frame) {
        resolve.apply(undefined, [frame].concat(args));
        return;
      }
      raf_1(count);
    };
    raf_1(count);
  });
}

function throttle(cb) {
  var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (typeof cb !== 'function') {
    throw new Error('callback needs to be a function');
  }
  var f = true;
  var i = 0;

  var frame = function frame() {
    i += 1;
    if (f) {
      if (frames && i % frames === 0) {
        cb();
      }
      raf_1(frame);
    }
  };
  raf_1(frame);
  return function () {
    f = false;
  };
}

function until(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return frame$1().then(function () {
    var result = fn.apply(undefined, args);
    if (result) {
      return until.apply(undefined, [fn].concat(args));
    }
    return args && args.length > 1 ? args : result;
  });
}

function when(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return frame$1().then(function () {
    var result = fn.apply(undefined, args);
    if (result) {
      return args && args.length > 1 ? args : result;
    }
    return when.apply(undefined, [fn].concat(args));
  });
}

// "test": "jest --config config.json",
// "test-ci": "jest --config config.json --coverage",
// "prepublish": "npm run build"
//

exports['default'] = frame$1;
exports.delay = delay;
exports.loop = loop;
exports.nextFrame = nextFrame;
exports.frame = frame$1;
exports.sequence = sequence;
exports.wait = wait;
exports.throttle = throttle;
exports.until = until;
exports.when = when;
//# sourceMappingURL=nextframe.js.map
