const fs = require('fs');
const ws = require('windows-shortcuts');
const path = require('path');

const firstRunFile = path.join(__dirname, 'first-run.flag');

// TODO: make sure first run file is not created if setup fails

fs.access(firstRunFile, fs.constants.F_OK, (err) => {
	if (err) {
		console.log('Performing first time setup:');

		// Perform first run tasks
		const platform = process.platform;
		const arch = process.arch;
		console.log(`Platform: ${platform}`);
		console.log(`Architecture: ${arch}`);

		// Linux

		if (platform === 'linux') {
			const appName = 'smol-menubar';
			const appEntryPoint = 'index.js';
			const appDir = __dirname;
			const appPath = `${appDir}/${appEntryPoint}`;

			const appIconPath = `${appDir}/images/icon.png`;

			const desktopEntryContent = `[Desktop Entry]
Type=Application
Name=${appName}
Exec=/bin/bash -c "cd ${appDir}&& npm run launch"
Icon=${appIconPath}
Terminal=false
Categories=Utility;`;

			const desktopEntryFileName = `${appName
				.toLowerCase()
				.replace(/ /g, '-')}.desktop`;
			const desktopEntryPath = `${process.env.HOME}/.local/share/applications/${desktopEntryFileName}`;

			fs.writeFile(desktopEntryPath, desktopEntryContent, (err) => {
				if (err) {
					console.error('Error creating .desktop file:', err);
				} else {
					console.log('.desktop file created');

					//Install the .desktop file
					const { exec } = require('child_process');
					const installCommand = `desktop-file-install --dir=$HOME/.local/share/applications ${desktopEntryPath}`;

					exec(installCommand, (err, stdout, stderr) => {
						if (err) {
							console.error(
								'Error executing desktop-file-install command:',
								err,
							);
							return;
						}
						console.log('Desktop file installed successfully');
					});
				}
			});
		}

		// Windows

		if (platform === 'win32') {
			const appName = 'smol-menubar';
			const appFileName = '${appName}.lnk';
			const shortcutPath = path.join(
				'C:\\Users\\${process.env.USERNAME}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup',
				appFileName,
			);

			const appEntryPoint = 'index.js';
			const appDir = __dirname;
			const appPath = path.join(appDir, appEntryPoint);

			ws.create(shortcutPath, { target: appPath }, (err) => {
				if (err) {
					console.error('Error creating shortcut:', err);
				} else {
					console.log('Shortcut created');
				}
			});
		}

		// // macOS // SWYX: disabled macos for myself bc i dont like it cluttering my desktop. let me know if you want it back and have an opt in way of running this
		// const { exec } = require('child_process');

		// if (platform === 'darwin') {
		//   const appName = 'smol-menubar';
		//   const appEntryPoint = 'index.js';
		//   const appDir = __dirname;
		//   const appPath = `${appDir}/${appEntryPoint}`;

		//   const appAliasName = `${appName}.alias`;
		//   const desktopPath = `${process.env.HOME}/Desktop`;
		//   const appAliasPath = `${desktopPath}/${appAliasName}`;

		//   const osascriptCommand = `osascript -e 'tell application "Finder" to make alias file to POSIX file "${appPath}" at POSIX file "${desktopPath}"'`;

		//   exec(osascriptCommand, (err, stdout, stderr) => {
		//     if (err) {
		//       console.error('Error creating alias:', err);

		//     } else {
		//       console.log('Alias created');
		//     }
		//   });
		// }

		// Create first run flag file, This file is used to determine if the app has been run before
		fs.closeSync(fs.openSync(firstRunFile, 'w'));
	} else {
		console.log('Setup has already been run, Skipping...');
	}
});
