import test from 'ava';
import now from 'performance-now';

import nextFrame, { loop, delay, when, until, sequence, wait, throttle } from './lib/nextframe';

test('call next frame with argument', async t => {
  const value = await nextFrame('check');
  t.is(value, 'check');
});

test('resolve when fn returns a truthy value.', async t => {

	let x = 0;
	wait(10).then(()=> x = 1);

  const value = await when(() => x >= 1);
  t.is(value, true);
});


test('until fn returns a truthy value do not resolve.', async t => {

	let x = 0;
	wait(10).then(()=> x = 1);

  const value = await until(() => x >= 1);
  t.is(value, false);
});


test('delay 1s with args', async t => {
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

test('loop', async t => {
  const p = new Promise(resolve => {
    let i = 0;
    const cancel = loop(() => {
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
  const cancel = loop(() => ++i);

  const result = await wait(50);

  cancel();
  t.is(result, 50);
  t.is(i, 50);
});

test('throttle frames', async t => {
  let i = 0;
  let throttleCount = 0;

  const p = new Promise(resolve => {
    const cancel = loop(() => ++i);

    const cancelThrottle = throttle(() => {
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
