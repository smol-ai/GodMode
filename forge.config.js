const { parsed } = require('dotenv').config();

const isSigning = process.env.NODE_ENV === 'sign';

module.exports = {
	packagerConfig: {
		name: 'smolmenubar',
		executableName: 'smolmenubar',
		icon: 'images/icon',
		appBundleId: 'com.smol.menubar',
		extendInfo: {
			LSUIElement: 'true',
		},
		...(!isSigning
			? {}
			: {
					osxSign: {
						'hardened-runtime': true,
						identity: 'Developer ID Application: Shawn Wang (7SVH735GV7)',
						entitlements: './entitlements.mac.plist',
						'entitlements-inherits': './entitlements.mac.plist',
						'signature-flags': 'library',
					},
					osxNotarize: {
						tool: 'notarytool',
						// https://www.electronforge.io/guides/code-signing/code-signing-macos
						appleApiKey: `build/AuthKey_QRJN4Y5JG6.p8`,
						appleApiKeyId: 'QRJN4Y5JG6',
						appleApiIssuer: '58a60bb5-5495-4a08-b180-2c106e11bc66',
						// appleId: process.env.APPLE_ID,
						// appleIdPassword: process.env.APPLE_PASSWORD,
						// teamId: process.env.APPLE_TEAM_ID
					},
			  }),
	},
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'smol-ai',
					name: 'menubar',
				},
				prerelease: true,
			},
		},
	],

	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {},
		},
		{
			name: '@electron-forge/maker-dmg',
			platforms: ['darwin'],
			config: {},
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {},
		},
	],
};
