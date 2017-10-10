import nextFrame from './nextframe';
/**
 * call a function sequencely every next frame on every iterating position of an array
 * @param  {Array} collection - keeps all values that will be used as the argument for the function
 * @param  {Function} fn - will be called with array values as aruments
 * @return {Promise} - which will resolve after the sequence
 */
export default function sequence(collection, fn) {
  let chain = Promise.resolve();
  const values = [];
  collection.forEach((item) => {
    chain = chain
      .then(() => nextFrame()
        .then(() => values.push(fn(item))));
  });
  return chain.then(() => values);
}
