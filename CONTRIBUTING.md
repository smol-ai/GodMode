# contributors guide


## seeking contributors!

this is a FOSS effort and will never be commercialized (no tracking, will not be a paid app (but the chat apps within might), etc). please check out the feature requests (https://github.com/smol-ai/menubar/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) if you'd like to help! in particular, we'd like:

- **a PR to make the 3 panels customizable to different URLs and input targets!**
- a "Windows maintainer" to handle Windows user needs and beta test every release to make sure we didn't break something for them
- Design
   - i need a new set of icons for the images
   - better styling for the window? maybe normalize the bard window to the openai dimensions?

## Install and Run from Source

To install and run from source, follow these steps:

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/smol-ai/menubar.git
   cd menubar
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


## debugging

I have the menubar devtools up all the time while in development. You can disable them by commenting this line. 

```js
window.webContents.openDevTools();
```
