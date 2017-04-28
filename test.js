import test from 'ava';
import nextFrame, {nextFrames, delay, sequence } from './lib';
import now from 'performance-now';

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
		const cancel = nextFrames(()=>{
			++i;
			if(i >= 20){
				cancel();
				resolve(20);
			}
		})
	})
  const result = await p;
  t.is(result, 20);
});
