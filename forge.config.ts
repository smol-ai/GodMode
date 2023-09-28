import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { app } from 'electron';
import path from 'path';
import { PublisherGithub } from '@electron-forge/publisher-github';
import Electron from 'electron';
import rendererProdConfig from './scripts/configs/webpack.config.renderer.prod';
import rendererDevConfig from './scripts/configs/webpack.config.renderer.dev';
import mainProdConfig from './scripts/configs/webpack.config.main.prod';
import mainDevConfig from './scripts/configs/webpack.config.preload.dev';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const isProduction = process.env.NODE_ENV === 'production';

const PRODUCT_NAME = 'GodMode';
// TODO: Use this for assets (e.g. icons)
// const APP_PATH = './src/images';

// const IMAGES_PATH =
// 	app && app.isPackaged
// 		? path.join(process.resourcesPath, 'src/images')
// 		: path.join(__dirname, './src/images');

const config: ForgeConfig = {
	packagerConfig: {
		asar: true,

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
	rebuildConfig: {},
	makers: [
		// Windows
		new MakerSquirrel({
			name: PRODUCT_NAME,
			// https://www.electronforge.io/guides/code-signing/code-signing-windows
			// certificateFile: './cert.pfx',
			// certificatePassword: process.env.CERTIFICATE_PASSWORD,
			setupIcon: `${__dirname}/src/images/icon@2x.png`,
		}),

		// Zip
		// TODO: Do we want to make a zip?
		// new MakerZIP({}, ['darwin']),

		// Redhat Package Manager
		new MakerRpm({
			options: {
				homepage: 'https://smol.ai/',
				genericName: PRODUCT_NAME,
			},
		}),

		// Debian Package Manager
		new MakerDeb({
			options: {
				genericName: PRODUCT_NAME,
				maintainer: 'smol-ai',
				homepage: 'https://smol.ai/',
				// icon: './assets/icons/icon.png',
			},
		}),

		// Apple Disk Image
		new MakerDMG({
			name: PRODUCT_NAME,
			format: 'ULFO',
			icon: `${__dirname}/src/images/icon@2x.png`,
			iconSize: 128,
			// background: './assets/icons/background.png', // TODO: Background image for DMG installer
			contents: [
				{
					x: 448,
					y: 344,
					type: 'link',
					path: '/Applications',
					name: 'Applications',
				},
				{
					x: 192,
					y: 344,
					type: 'file',
					path: `${__dirname}/out/GodMode-darwin-arm64/GodMode.app`,
					name: 'GodMode.app',
				},
			],
		}),
	],
	publishers: [
		new PublisherGithub(
			{
				repository: {
					owner: 'smol-ai',
					name: PRODUCT_NAME,
				},
			},
			['darwin', 'win32'],
		),
	],
	plugins: [
		new AutoUnpackNativesPlugin({}),
		new WebpackPlugin({
			mainConfig: isProduction ? mainProdConfig : mainDevConfig,
			renderer: {
				config: isProduction ? rendererDevConfig : rendererProdConfig,
				entryPoints: [
					{
						html: './src/renderer/index.ejs',
						js: './src/renderer/index.tsx',
						name: 'main_window',
						preload: {
							js: './src/main/preload.ts',
						},
					},
				],
			},
		}),
	],
};

export default config;
