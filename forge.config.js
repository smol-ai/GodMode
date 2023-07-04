const { parsed } = require("dotenv").config();

module.exports = {
  packagerConfig: {
    name: "smolmenubar",
    executableName: "smolmenubar",
    icon: "images/icon",
    appBundleId: "com.smol.menubar",
    extendInfo: {
      LSUIElement: "true",
    },
    osxSign: {
      hardenedRuntime: true,
      gatekeeperAssess: false,
      identity: "Developer ID Application: Shawn Wang (7SVH735GV7)",
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    }
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "smol-ai",
          name: "menubar",
        },
        prerelease: true,
      },
    },
  ],

  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
