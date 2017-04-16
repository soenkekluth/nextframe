import test from 'ava';
import nextFrame from './index';


test('call next frame', async t => {
	const value = await nextFrame('check');
	t.is(value, 'check');
});
