import raf from 'raf';

/**
 * delays the call to nextFrame with setTimeout
 * @param  {Number} ms - delay in ms
 * @param  {...} args - optional values that would be the params of the Promises resolve
 * @return {Promise} - which will resolve after the delayed animationframe
 */
export default function delay(ms = 0, ...args) {
  return new Promise(resolve => setTimeout(() => {
    raf(() => resolve(...args));
  }, ms));
}
