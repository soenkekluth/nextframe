# nextframe

[![Greenkeeper badge](https://badges.greenkeeper.io/soenkekluth/nextframe.svg)](https://greenkeeper.io/)


[![Build Status](https://travis-ci.org/soenkekluth/nextframe.svg?branch=master)](https://travis-ci.org/soenkekluth/nextframe)

> Promise for requestAnimationFrame plus nextFrames, sequence, delay, throttleFrames, waitFrames

Read the docs <https://soenkekluth.github.io/nextframe>

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

```
npm i --save nextframe
```

## Usage

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

## Maintainers

[@soenkekluth](https://github.com/soenkekluth)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2017 Sönke Kluth


## Overview

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

