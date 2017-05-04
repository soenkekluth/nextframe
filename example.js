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
