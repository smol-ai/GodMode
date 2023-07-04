import childProcess from "child_process";
(function() {
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
      console.log('spawn called');
      console.log(arguments);
      var result = oldSpawn.apply(this, arguments);
      return result;
  }
  childProcess.spawn = mySpawn;
})();
// build/notarize.js
import { notarize } from '@electron/notarize';
// import { build } from '../package.json';

// const electronPlatformName = 'darwin'
// const appOutDir = 'out/menubar-darwin-x64'
const appOutDir = '/Users/swyx/Documents/Work/menubar/out/menubar-darwin-x64'

const appName = 'smolmenubar.app';

console.log({appOutDir, appName})
// await notarize({
//   appBundleId: build.appId,
//   appPath: `${appOutDir}/${appName}.app`,
//   appleId: process.env.APPLE_ID,
//   appleIdPassword: process.env.APPLE_PASSWORD,
// });
await notarize({
  tool: "notarytool",
  appPath: `${appOutDir}/${appName}`,
  appleId: process.env.APPLE_ID,
  appleIdPassword: process.env.APPLE_PASSWORD,
  teamId: process.env.APPLE_TEAM_ID
});