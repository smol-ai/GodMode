// require("update-electron-app")(); // uncomment this line to enable auto-updates.
// we commented out because of https://github.com/smol-ai/menubar/issues/17

const log = require('electron-log');
const { menubar } = require('menubar');

const path = require('path');
const {
	app,
	BrowserWindow,
	nativeImage,
	Tray,
	Menu,
	globalShortcut,
	shell,
} = require('electron');
const { version } = require('./package.json');

const providers = {
	OpenAi: require('./providers/openai'),
	Bard: require('./providers/bard'),
	Bing: require('./providers/bing'),
	Claude: require('./providers/claude'),
};

const allProviders = Object.values(providers);

const Store = require('electron-store');
const store = new Store();
log.info('store', store);

const contextMenu = require('electron-context-menu');

const image = nativeImage.createFromPath(
	path.join(__dirname, `images/newiconTemplate.png`)
);

app.on('ready', () => {

	const tray = new Tray(image);

	const mb = menubar({
		browserWindow: {
			icon: image,
			transparent: path.join(__dirname, `images/iconApp.png`),
			autoHideMenuBar: false,
			webPreferences: {
				webviewTag: true,
				nodeIntegration: true,
				contextIsolation: false,
				enableWebView: true, // from chatgpt
				// nativeWindowOpen: true,
			},
			width: 1200,
			height: 750,
		},
		tray,
		showOnAllWorkspaces: true,
		preloadWindow: true,
		showDockIcon: false,
		icon: image,
	});

	mb.on('ready', () => {
		const { window } = mb;

		if (process.platform !== 'darwin') {
			window.setSkipTaskbar(true);
		} else {
			app.dock.hide();
		}

    const createContextMenuTemplate = () => {
      const menuHeader = [
        {
          label: 'Quit',
          accelerator: 'CommandorControl+Q',
          click: () => {
            app.quit();
          },
        },
        {
          label: 'Reload',
          accelerator: 'CommandorControl+R',
          click: () => {
            window.reload();
          },
        },
        {
          label: 'Quick Open (use this!)',
          accelerator: 'CommandorControl+Shift+G',
          click: () => {
            window.reload();
          },
        }
      ];

      const separator = { type: 'separator' };

      const providersToggles = allProviders.map(provider => {
        return {
          label: store.get(`${provider.webviewId}Enabled`, true)
            ? `Disable ${provider.fullName}`
            : `Enable ${provider.fullName}`,
          type: 'checkbox',
          checked: store.get(`${provider.webviewId}Enabled`, true), // default to true if not set
          click: () => {
            store.set(
              `${provider.webviewId}Enabled`,
              !store.get(`${provider.webviewId}Enabled`, true)
            );
            window.reload();
          },
        };
      });

      const superPromptEnterKey = {
        label: 'Enable Super Prompt "Enter" key',
        type: 'checkbox',
        checked: store.get('SuperPromptEnterKey', false),
        click: () => {
          store.set('SuperPromptEnterKey', !store.get('SuperPromptEnterKey', false));
          window.reload();
        },
      };

      const providerLinks = allProviders.map(provider => {
        return {
          label: `Visit ${provider.name} website`,
          click: () => {
            shell.openExternal(provider.url);
          },
        };
      });

      const menuFooter = [
        // Removing the preferences window for now because all settings are now
        // in the menubar context menu dropdown. (Seemed like a better UX)
        // {
        //   label: 'Preferences',
        //   click: () => {
        //     const preferencesWindow = new BrowserWindow({
        //       parent: null,
        //       modal: false,
        //       alwaysOnTop: true,
        //       show: false,
        //       autoHideMenuBar: true,
        //       width: 500,
        //       height: 300,
        //       webPreferences: {
        //         nodeIntegration: true,
        //         contextIsolation: false,
        //       },
        //     });
        //     preferencesWindow.loadFile('preferences.html');
        //     preferencesWindow.once('ready-to-show', () => {
        //       mb.hideWindow();
        //       preferencesWindow.show();
        //     });

        //     // When the preferences window is closed, show the main window again
        //     preferencesWindow.on('close', () => {
        //       mb.showWindow();
        //       mb.window.reload(); // reload the main window to apply the new settings
        //     });
        //   },
        // },
        {
          label: 'View on GitHub',
          click: () => {
            shell.openExternal('https://github.com/smol-ai/menubar');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Version ' + version,
        }
      ]


      return [
        ...menuHeader,
        separator,
        ...providersToggles,
        separator,
        superPromptEnterKey,
        separator,
        ...providerLinks,
        separator,
        ...menuFooter,
      ]
    };

		tray.on('right-click', () => {
      const contextMenuTemplate = createContextMenuTemplate();
			mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
		});

		tray.on('click', e => {
			//check if ctrl or meta key is pressed while clicking
			if (e.ctrlKey || e.metaKey) {
        const contextMenuTemplate = createContextMenuTemplate();
        mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
      }
		});
		const menu = new Menu();

		globalShortcut.register('CommandOrControl+Shift+g', () => {
			if (window.isVisible()) {
				mb.hideWindow();
			} else {
				mb.showWindow();
				if (process.platform == 'darwin') {
					mb.app.show();
				}
				mb.app.focus();
			}
		});

		Menu.setApplicationMenu(menu, { autoHideMenuBar: false });

		// open devtools if in dev mode
		if (process.env.NODE_ENV === 'development') {
			window.webContents.openDevTools();
		}

		console.log('Menubar app is ready.');
	});

	app.on('web-contents-created', (e, contents) => {
		if (contents.getType() == 'webview') {
			// contents.on("will-navigate", (event, url, frameName, disposition, options, additionalFeatures) => {
			//   console.log({frameName})
			//   if (frameName === 'my_popup') {
			//     // Open `url` in a new window...
			//     event.preventDefault()
			//     Object.assign(options, {
			//       parent: win,
			//       width: 500,
			//       height: 400
			//     })
			//     event.newGuest = new BrowserWindow(options)
			//   }
			// })
			// open link with external browser in webview
			contents.setWindowOpenHandler('new-window', (e, url) => {
				e.preventDefault();
				shell.openExternal(url);
			});
			// set context menu in webview
			contextMenu({
				window: contents,
			});

			// we can't set the native app menu with "menubar" so need to manually register these events
			// register cmd+c/cmd+v events
			contents.on('before-input-event', (event, input) => {
				const { control, meta, key } = input;
				if (!control && !meta) return;
				if (key === 'c') contents.copy();
				// if (key === "v") contents.paste(); // we will handle this manually
				if (key === 'a') contents.selectAll();
				if (key === 'z') contents.undo();
				if (key === 'y') contents.redo();
				if (key === 'q') app.quit();
				if (key === 'r') contents.reload();
			});
		}
		// we can't set the native app menu with "menubar" so need to manually register these events
		// register cmd+c/cmd+v events
		contents.on('before-input-event', (event, input) => {
			const { control, meta, key } = input;
			if (!control && !meta) return;
			if (key === 'c') contents.copy();
			if (key === 'v') contents.paste();
			if (key === 'a') contents.selectAll();
			if (key === 'z') contents.undo();
			if (key === 'y') contents.redo();
			if (key === 'q') app.quit();
			if (key === 'r') contents.reload();
		});
	});

	if (process.platform == 'darwin') {
		// restore focus to previous app on hiding
		mb.on('after-hide', () => {
			mb.app.hide();
		});
	}

	// open links in new window
	// app.on("web-contents-created", (event, contents) => {
	//   contents.on("will-navigate", (event, navigationUrl) => {
	//     event.preventDefault();
	//     shell.openExternal(navigationUrl);
	//   });
	// });

	// prevent background flickering
	app.commandLine.appendSwitch(
		'disable-backgrounding-occluded-windows',
		'true'
	);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
