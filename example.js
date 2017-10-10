const {
  nextFrame, loop, sequence, delay, throttleFrames, waitFrames,
} = require('./lib');
const now = require('performance-now');

const increment = val => val + 1;

const sequenceValues = [1, 2, 3, 4];
let frameCount = 0;
let throttleCount = 0;

const start = now();

/** **************************
  nextFrame / frame
*************************** */
nextFrame()
  .then(() => {
    console.log('next frame');
  });

/** **************************
  delay
*************************** */
delay(1000).then(() => {
  console.log(`delayed ${now() - start}ms`);
});

/** **************************
  sequence / frameSequence
*************************** */
sequence(sequenceValues, increment)
  .then(result => console.log(result));

/** **************************
  loop / nextFrames / onEnterFrame
*************************** */
const cancelLoop = loop(() => {
  console.log('frame', frameCount += 1);
  if (frameCount >= 100) {
    cancelLoop();
  }
});

/** **************************
		throttleFrames / throttle
*************************** */
const cancelThrottle = throttleFrames(() => {
  console.log('throttle', throttleCount += 1);
  if (throttleCount >= 10) {
    cancelThrottle();
  }
}, 10);

/** **************************
  waitFrames / wait
*************************** */
waitFrames(50).then((count) => {
  console.log(`${count} frames waited`);
});
