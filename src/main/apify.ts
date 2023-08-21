import { ProviderInterface } from 'lib/types';
import { BrowserWindow } from 'electron';

export async function streamChatResponse(opts: {
	provider: ProviderInterface;
	prompt: string;
	sendFn: (...args: any[]) => void | undefined;
}) {
	const win = new BrowserWindow({
		// show: true,
		show: false,
		// titleBarStyle: 'hidden',
		// width: 800,
		// height: 600,
		// webPreferences: {
		// 	webviewTag: true,
		// 	nodeIntegration: true,
		// },
	});
	win.loadURL(opts.provider.url);

	return new Promise((resolve, reject) => {
		win.webContents.on('dom-ready', async () => {
      try {
        // check if logged in (and inputElement exists)
        await win.webContents.executeJavaScript(`{${opts.provider.codeForInputElement}}`)
      } catch (err) {
        console.error('input element doesnt exist: ', opts.provider.codeForInputElement)
        return reject(err)
      }
      await timeout(500);
      const script = `{
				${opts.provider.codeForInputElement}
        ${opts.provider.codeForSetInputElementValue!(opts.prompt)}
        ${opts.provider.codeForClickingSubmit}
			}`
			await win.webContents.executeJavaScript(script);
      console.log('script', script)
      
      // Define two variables to store the previous responses
      let lastResponseHTML = null;
      let secondLastResponseHTML = null;

      console.log('looping')
      // Loop until our condition is met
      await timeout(300);
      while (true) {
          await timeout(300);
          await win.webContents.executeJavaScript(`console.log('hiii', [...document.querySelectorAll('.default.font-sans.text-base.text-textMain .prose')]);`);
          var responseHTML = await win.webContents.executeJavaScript(`${opts.provider.codeForExtractingResponse}.innerHTML`);
          var responseText = await win.webContents.executeJavaScript(`${opts.provider.codeForExtractingResponse}.innerText`);

				console.log({ responseHTML, secondLastResponseHTML });
				// If responseHTML hasn't changed for 2 invocations, break
				if (
					responseHTML === lastResponseHTML &&
					responseHTML === secondLastResponseHTML
				) {
					console.log('prompting');
					break;
				}

				// Shift our stored responses for the next loop iteration
				secondLastResponseHTML = lastResponseHTML;
				lastResponseHTML = responseHTML;

				console.log('sendFn', responseText);
				opts.sendFn(responseHTML, responseText); // stream incomplete responses back
			}
			console.log('closing');
			win.close();
			return resolve({ responseHTML, responseText });
		});
	});
}
// thanks claude

function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
