import raf from 'raf';

/**
 * create an animationframe loop that calls a function (callback) in every frame
 * @param  {Function} cb - gets called in every frame - for rendering mostly
 * @return {Function} - a function which cancels the initialed loop by calling it
 */
export default function loop(cb) {
  if (typeof cb !== 'function') {
    throw new Error('callback needs to be a function');
  }
  let f = true;
  const frame = () => {
    if (f) {
      cb();
      raf(frame);
    }
  };

  raf(frame);
  return () => {
    f = false;
  };
}

