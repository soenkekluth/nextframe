[![Build Status](https://travis-ci.org/soenkekluth/nextframe.svg?branch=master)](https://travis-ci.org/soenkekluth/nextframe)

# nextframe
Promise for requestAnimationFrame / plus features like nextFrames, frameSequence, delay, throttleFrames, waitFrames


## usage
```js
const { nextFrame, nextFrames, sequence, delay, throttleFrames, waitFrames } = require('./lib');
const now = require('performance-now');

const increment = val => ++val;

const sequenceValues = [1, 2, 3, 4];
let frameCount = 0;
let throttleCount = 0;

const start = now();

/****************************
		nextFrame
****************************/
nextFrame()
  .then(() => {
    console.log('next frame');
  })

/****************************
		delay
****************************/
delay(1000).then(() => {
  console.log('delayed ' + (now() - start) + 'ms');
});

/****************************
		sequence / frameSequence
****************************/
sequence(sequenceValues, increment)
  .then(result => console.log(result));

/****************************
		nextFrames
****************************/
const cancelNext = nextFrames(() => {
  console.log('frame', ++frameCount);
  if (frameCount >= 100) {
    cancelNext();
  }
});

/****************************
		throttleFrames
****************************/
const cancelThrottle = throttleFrames(() => {
  console.log('throttle', ++throttleCount);
  if (throttleCount >= 10) {
    cancelThrottle();
  }
}, 10);

/****************************
		waitFrames
****************************/
waitFrames(50).then((count) => {
  console.log(count + ' frames waited');
})

```


## tests
(*passing*)

```js
import test from 'ava';
import now from 'performance-now';

import nextFrame, { nextFrames, delay, sequence, waitFrames, throttleFrames } from './lib';

test('call next frame with argument', async t => {
  const value = await nextFrame('check');
  t.is(value, 'check');
});

test('delay 1s', async t => {
  const start = now();
  const value = await delay(1000, 'check');
  const duration = now() - start;
  t.is(value, 'check');
  t.truthy(duration >= 1000 && duration <= 1100);
});

test('sequence', async t => {
  const values = [1, 2, 3, 4];
  const increment = val => ++val;
  const result = await sequence(values, increment);
  t.deepEqual(result, [2, 3, 4, 5]);
});

test('nextFrames loop', async t => {
  const p = new Promise(resolve => {
    let i = 0;
    const cancel = nextFrames(() => {
      ++i;
      if (i >= 20) {
        cancel();
        resolve(20);
      }
    })
  })
  const result = await p;
  t.is(result, 20);
});

test('wait 50 frames', async t => {
  let i = 0;
  const cancel = nextFrames(() => ++i);

  const result = await waitFrames(50);

  cancel();
  t.is(result, 50);
  t.is(i, 50);
});

test('throttle frames', async t => {
  let i = 0;
  let throttleCount = 0;

  const p = new Promise(resolve => {
    const cancel = nextFrames(() => ++i);

    const cancelThrottle = throttleFrames(() => {
      if (++throttleCount >= 10) {
        cancelThrottle();
        cancel();
        resolve(throttleCount)
      }
    }, 10);
  });
  const result = await p;
  t.is(result, 10);
  t.is(i, 100);
});
```
