import raf from 'raf';
/**
 * create a throttled animationframe loop that calls a function (callback) in every specified
 * @param  {Function} cb - gets called in every specified frame
 * @param  {Number} frames - throttle in wich interval cb is called
 * @return {Function} - a function which cancels the initialed loop by calling it
 */
export default function throttle(cb, frames = 1) {
  if (typeof cb !== 'function') {
    throw new Error('callback needs to be a function');
  }
  let f = true;
  let i = 0;

  const frame = () => {
    i += 1;
    if (f) {
      if (frames && (i % frames === 0)) {
        cb();
      }
      raf(frame);
    }
  };
  raf(frame);
  return () => {
    f = false;
  };
}

