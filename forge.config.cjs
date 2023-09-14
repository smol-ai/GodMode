const path = require('path');
const { app } = require('electron');

const PRODUCT_NAME = 'GodMode'
const APP_PATH = './src/images'

const IMAGES_PATH = (app && app.isPackaged)
  ? path.join(app.resourcesPath, 'src/images')
  : path.join(__dirname, './src/images');

// const getAssetPath = (...paths: string[]): string => {
// return path.join(RESOURCES_PATH, ...paths);
// };
console.log('__dirname', __dirname)
module.exports = {
  packagerConfig: {
    asar: true,
    platform: ['darwin', 'win32', 'linux'],
    arch: ['x64', 'arm64']

    // TODO: Uncomment these when ready to notarize and sign
    // osxNotarize: {
    //   appBundleId: 'com.example.electron-forge',
    //   appleId: process.env.APPLE_ID,
    //   appleIdPassword: process.env.APPLE_ID_PASSWORD,
    //   ascProvider: process.env.ASC_PROVIDER,
    // },

    // osxSign: {
    //   hardenedRuntime: true,
    //   identity: 'Developer ID Application: Your Name (XXXXXXXXXX)',
    //   'gatekeeper-assess': false,
    //   'entitlements': '/entitlements.mac.plist',
    //   'entitlements-inherit': '/entitlements.mac.plist',
    // },

  },
  makers: [

    // https://www.electronforge.io/config/makers/squirrel.windows

    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: PRODUCT_NAME,
        // https://www.electronforge.io/guides/code-signing/code-signing-windows
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERTIFICATE_PASSWORD,
        setupIcon: `${__dirname}/src/images/icon@2x.png`,
      },
    },

    // https://www.electronforge.io/config/makers/dmg

    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: PRODUCT_NAME,
        format: 'ULFO',
        icon: `${__dirname}/src/images/icon@2x.png`,
        iconSize: 128,
        // background: './assets/icons/background.png', // TODO: Background image for DMG installer
        contents: [
          { x: 448, y: 344, type: 'link', path: '/Applications' },
          { x: 192, y: 344, type: 'file', path: `${__dirname}/out/GodMode-darwin-arm64/GodMode.app` },
        ],
      },
    },

    // https://www.electronforge.io/config/makers/deb

    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          genericName: PRODUCT_NAME,
          maintainer: 'smol-ai',
          homepage: 'https://smol.ai/',
          // icon: './assets/icons/icon.png',
        }
      },
    },

    // https://www.electronforge.io/config/makers/rpm

    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://smol.ai/',
          genericName: PRODUCT_NAME,
        },
      },
    },
  ],
  publishers: [

    // https://www.electronforge.io/config/publishers/github

    {
      name: '@electron-forge/publisher-github',
      platforms: ['darwin', 'win32'],
      config: {
        repository: {
          owner: 'smol-ai',
          name: 'GodMode-forge' // TODO: Change to GodMode when ready
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};