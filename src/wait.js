import raf from 'raf';

/**
 * waiting x frames before the Promise will resolve
 * @param  {Number} frame - the number of frames the Promise waits before resolving
 * @param  {...} args - optional values that would be the params of the Promises resolve
 * @return {Promise} - which will resolve after the waiting frames
 */
export default function wait(frame = 1, ...args) {
  return new Promise((resolve) => {
    let i = 0;
    const count = () => {
      if (++i >= frame) {
        resolve(frame, ...args);
        return;
      }
      raf(count);
    };
    raf(count);
  });
}
