const nextFrame = require('./');

nextFrame()
  .then(() => {
    console.log('next frame');
  })

nextFrame.delay(1000).then(() => {
  console.log('delay');
})
