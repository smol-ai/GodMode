// npm run make first

const { signAsync } = require('@electron/osx-sign')
signAsync({
  app: 'out/make/smolmenubar-darwin-arm64/smolmenubar.app',
})
  .then(function () {
    // Application signed
    console.log('success')
  })
  .catch(function (err) {
    console.log('err', err)
    // Handle the error
  })