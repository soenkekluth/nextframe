import test from 'ava';
import nextFrame, {delay, sequence} from './index';


test('call next frame', async t => {
	const value = await nextFrame('check');
	t.is(value, 'check');
});

test('delay 1s', async t => {
	const value = await delay(1000, 'check');
	t.is(value, 'check');
});


test('sequence', async t => {
	const values = [1,2,3,4];
	const increment = val => ++val;
	const result = await sequence(values, increment);
	console.log(result);
	t.deepEqual(result, [2,3,4,5]);
});
