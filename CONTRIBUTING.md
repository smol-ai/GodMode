# contributors guide

## seeking contributors!

this is a FOSS effort and will never be commercialized (no tracking, will not be a paid app (but the chat apps within might), etc). please check out the feature requests (https://github.com/smol-ai/GodMode/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) if you'd like to help! in particular, we'd like:

- **a PR to make the 3 panels customizable to different URLs and input targets!**
- a "Windows maintainer" to handle Windows user needs and beta test every release to make sure we didn't break something for them

## Install and Run from Source

To install and run from source, follow these steps:

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/smol-ai/GodMode.git
   cd GodMode
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application and generate the platform-specific desktop file:

   ```bash
   npm run start
   ```

   This command will launch the application and automatically generate the appropriate desktop file or shortcut for your operating system (Linux, macOS, or Windows).

## adding/fixing providers

The best way to contribute is to add new providers or improve existing ones. Check out the [providers folder](https://github.com/smol-ai/GodMode/tree/main/src/providers) to see how they work.

The Provider base class is https://github.com/smol-ai/GodMode/blob/main/src/providers/provider.js and mostly you have to do 3 things to add a provider:

- edit the `var inputElement = document.querySelector('div.ProseMirror')` to target the right element for chat input
- edit the `var btn = document.querySelector("button[aria-label*='Send Message']");` to target the right button element to send the message
- (optional) edit the `handleCss` to clean up the UI for a small window view

See https://github.com/smol-ai/GodMode/blob/main/src/providers/claude2.js for a simple reference. Sometimes it gets more complicated, like [Bing provider](https://github.com/smol-ai/GodMode/blob/main/src/providers/bing.js), because of the DOM structure

## debugging

I have the devtools up all the time while in development. You can disable them by commenting this line.

```js
window.webContents.openDevTools();
```

## building and notarizing

Apple is a piece of sht.

copy `.env.example` to `.env` and follow https://www.electronforge.io/guides/code-signing/code-signing-macos (we tried option 1, but eventually ended up with option 2 as you see below)

then you have to generate a bunch of stuff
https://medium.com/ascentic-technology/getting-an-electron-app-ready-for-macos-distribution-2941fce27450

```bash
$ spctl -a -vvv -t install smolmenubar.app
smolmenubar.app: accepted
source=Notarized Developer ID
origin=Developer ID Application: Shawn Wang (7SVH735GV7)
```

all of this has now been packaged into a script called `npm run buildAndSign`. Note that for now, this script ONLY runs on swyx's macbook air inside the terminal (and somehow NOT in vsocde, i dont know why). If you are experienced with electron signing and notarizing, please help us make this work for all contributors!

```bash
npm run buildAndSign

> smolmenubar@0.0.16 buildAndSign
> NODE_ENV=sign npm run make


> smolmenubar@0.0.16 make
> electron-forge make --arch arm64,x64

✔ Checking your system
✔ Loading configuration
✔ Resolving make targets
  › Making for the following targets: dmg
✔ Loading configuration
✔ Resolving make targets
  › Making for the following targets: dmg
✔ Running package command
  ✔ Preparing to package application
  ✔ Running packaging hooks
    ✔ Running generateAssets hook
    ✔ Running prePackage hook
  ✔ Packaging application
    ✔ Packaging for arm64 on darwin [2m15s]
    ✔ Packaging for x64 on darwin [2m27s]
  ✔ Running postPackage hook
✔ Running preMake hook
✔ Making distributables
  ✔ Making a dmg distributable for darwin/arm64 [7s]
  ✔ Making a dmg distributable for darwin/x64 [8s]
✔ Running postMake hook
  › Artifacts available at: /Users/swyx/Documents/Work/smol-menubar/out/make
```

## publishing to app store

> NOTE: we havent actually gotten this working yet, i just straight up gave up

the below from https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds is something like what we want

```bash
xcrun altool --validate-app -f smolmenubar.app -t macos -u shawnthe1@gmail.com
```

but doesnt work

```bash
xcrun altool --validate-app -f smolmenubar.app --type macos -u shawnthe1@gmail.com
shawnthe1@gmail.com's password:

2023-07-04 00:09:32.533 *** Error: Validation failed for 'smolmenubar.app'.
2023-07-04 00:09:32.534 *** Error: Unable to determine app platform for 'Undefined' software type. App Store operation failed. (1194)
 {
    NSLocalizedDescription = "Unable to determine app platform for 'Undefined' software type.";
    NSLocalizedFailureReason = "App Store operation failed.";
    NSLocalizedRecoverySuggestion = "Unable to determine app platform for 'Undefined' software type.";
}
```
