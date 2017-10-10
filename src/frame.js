import raf from 'raf';

/**
 * create a Promise that resolves in the next Animationframe
 * @param  {...} args - optional values that would be the params of the Promises resolve
 * @return {Promise} - which will resolve in the next Animationframe
 */
export default function frame(...args) {
  return new Promise(resolve => raf(() => resolve(...args)));
}
