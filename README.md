[![Build Status](https://travis-ci.org/soenkekluth/nextframe.svg?branch=master)](https://travis-ci.org/soenkekluth/nextframe)

# nextframe
Promise for requestAnimationFrame / plus features like nextFrames, frameSequence, delay, throttleFrames, waitFrames

## overview

### nextFrame
create a Promise that resolves in the next Animationframe
@param  {...} args - optional values that would be the params of the Promises resolve
@return {Promise} which will resolve in the next Animationframe


### wait / alias waitFrames
waiting x frames before the Promise will resolve
@param  {Number}    frame - the number of frames the Promise waits before resolving
@param  {...} args   - optional values that would be the params of the Promises resolve
@return {Promise} which will resolve after the waiting frames



### when
resolve when fn returns a truthy value.
@param  {Function}  fn   a function that will be called every frame to check for changes
@param  {...[type]} args   - optional values that would be the params of the Promises resolve
@return {Promise} which will resolve after the waiting frames



### until
until fn returns a truthy value do not resolve.
@param  {Function}  fn   a function that will be called every frame to check for changes
@param  {...[type]} args   - optional values that would be the params of the Promises resolve
@return {Promise} which will resolve after the waiting frames



### loop
create an animationframe loop that calls a function (callback) in every frame
@param  {Function} cb - gets called in every frame - for rendering mostly
@return {Function}  a function which cancels the initialed loop by calling it



### throttle / alias throttleFrames
create a throttled animationframe loop that calls a function (callback) in every specified
@param  {Function} cb        gets called in every specified frame
@param  {Number}   throttle in wich interval cb is called
@return {Function}  a function which cancels the initialed loop by calling it



### delay
delays the call to nextFrame with setTimeout
@param  {Number}    ms    delay in ms
@param  {...} args   - optional values that would be the params of the Promises resolve
@return {Promise} which will resolve after the delayed animationframe



### sequence
call a function sequencely every next frame on every iterating position of an array
@param  {Array}   collection keeps all values that will be used as the argument for the function
@param  {Function} fn         will be called with array values as aruments
@return {Promise} which will resolve after the sequence


## usage
```js
import { nextFrame, loop, sequence, delay, throttleFrames, waitFrames } from 'nextframe';


const now = require('performance-now');
const increment = val => ++val;

const sequenceValues = [1, 2, 3, 4];
let frameCount = 0;
let throttleCount = 0;

const start = now();

/****************************
		nextFrame / frame
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
		loop / nextFrames / onEnterFrame
****************************/
const cancelLoop = loop(() => {
	console.log('frame', ++frameCount);
	if (frameCount >= 100) {
		cancelLoop();
	}
});

/****************************
		throttleFrames / throttle
****************************/
const cancelThrottle = throttleFrames(() => {
	console.log('throttle', ++throttleCount);
	if (throttleCount >= 10) {
		cancelThrottle();
	}
}, 10);

/****************************
		waitFrames / wait
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
