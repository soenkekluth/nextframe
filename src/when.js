import frame from './frame';

/**
 * resolve when fn returns a truthy value.
 * @param  {Function} fn - a function that will be called every frame to check for changes
 * @param  {...} args - optional values that would be the params of the Promises resolve
 * @return {Promise} - which will resolve after the waiting frames
 */
export default function when(fn, ...args) {
  return frame()
    .then(() => {
      const result = fn(...args);
      if (result) {
        return (args && (args.length > 1)) ? args : result;
      }
      return when(fn, ...args);
    });
}
