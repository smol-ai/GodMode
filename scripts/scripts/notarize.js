const { notarize } = require('@electron/notarize');
const { build } = require('../../package.json');

exports.default = async function notarizeMacos(context) {
	const { electronPlatformName, appOutDir } = context;
	if (electronPlatformName !== 'darwin') {
		return;
	}

	if (process.env.CI !== 'true') {
		console.warn('Skipping notarizing step. Packaging is not running in CI');
		return;
	}

	if (!('APPLE_ID' in process.env && 'APPLE_ID_PASS' in process.env)) {
		console.warn(
			'Skipping notarizing step. APPLE_ID and APPLE_ID_PASS env variables must be set'
		);
		return;
	}

	const appName = context.packager.appInfo.productFilename;

	const appPath =  `${appOutDir}/${appName}.app`;
	await notarize({
		appPath,
		// appleId: process.env.APPLE_ID,
		// appleIdPassword: process.env.APPLE_ID_PASS,
		tool: 'notarytool',
		// https://www.electronforge.io/guides/code-signing/code-signing-macos
		appleApiKey: `build/AuthKey_QRJN4Y5JG6.p8`,
		appleApiKeyId: 'QRJN4Y5JG6',
		appleApiIssuer: "58a60bb5-5495-4a08-b180-2c106e11bc66"
	});
};
