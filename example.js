const { nextFrame, nextFrames, sequence, delay } = require('./lib');
const now = require('performance-now');

nextFrame()
  .then(() => {
    console.log('next frame');
  })

const start = now();
console.log('request nextFrame after 1000ms delay');
delay(1000).then(() => {
  console.log('delayed ' + (now() - start) + 'ms');
});

let count = 0;
const cancel = nextFrames(()=>{
	console.log(++count);
	if(count >= 100){
		cancel();
	}
});


