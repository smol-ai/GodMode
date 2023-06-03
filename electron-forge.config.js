module.exports = {
  packagerConfig: {
    executableName: 'smolmenubar',
    outDir: 'out',
    dir: __dirname,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
    },
    {
      name: '@electron-forge/maker-zip',
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
    }
    {
      name: '@electron-forge/maker-dmg',
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
    },
  ],
};
