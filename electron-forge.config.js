const path = require('path');

module.exports = {
  packagerConfig: {
    executableName: 'smolmenubar',
    outDir: 'out',
    dir: __dirname,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.js",
              name: "main_window",
            },
          ],
        },
      },
    ],
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
    },
  ],
};
