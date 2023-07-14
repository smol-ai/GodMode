# 👼 smol menubar

This is a smol menubar app that helps you quickly access **the full webapps** of ChatGPT (defaults to "[GPT4.5](https://www.latent.space/p/code-interpreter#details)"!!), Bing and Anthropic Claude 2 with a single keyboard shortcut (Cmd+Shift+G). 

> we also support Bard, Claude 1, and local models like LLaMA and Vicuna (via [OobaBooga](https://github.com/oobabooga/text-generation-webui)) but hide by default bc they aren't as good!

![image](https://github.com/smol-ai/menubar/assets/6764957/0cc8f90a-b7eb-447c-808a-6883654dcad4)

([click for video demo](https://twitter.com/swyx/status/1678944036135260160))

Whatever is typed at the bottom is entered into all **web apps** simultaneously, however if you wish to explore one further than the other you can do so independently since they are just webviews. [See video demo](https://www.youtube.com/watch?v=wCGe3_L5a30)

## Oh so this is like nat.dev?

Yes and no:

1. SOTA functionality is often released without API (eg: ChatGPT Code Interpreter, Bing Image Creator, Bard Multimodal Input, Claude Multifile Upload). **We insist on using webapps** so that you have full access to all functionality on launch day.
2. This is a menubar app that can be invoked with a keyboard shortcut (Cmd+Shift+G). Feels a LOT faster than having it live in a browser window somewhere and is easy to pull up/dismiss during long generations.
3. Supports local models like LLaMa and Vicuna via [OobaBooga](https://github.com/oobabooga/text-generation-webui).
4. No paywall, build from source.

## Features and Usage

- **Keyboard Shortcut**: I usually just always press Cmd+Shift+G -> quick open to use it and Cmd+Enter to submit. 
   - You can modify these keyboard shortcuts if you build it from source.
- **Resize**: You can resize the overall window with a click n drag. Cmd+1/2/3/A/+/- or drag to resize the internal webviews as you wish.
- **Toggle Models**: You can also enable/disable models from the preferences modal and your choice is persisted. We support ChatGPT, Bing, Bard, Claude 1/2.
  - NEW: We have added initial support for https://github.com/oobabooga/text-generation-webui. You'll have to go thru their process, including downloading their models ([I use LLaMa-13B-GGML](https://huggingface.co/TheBloke/LLaMa-13B-GGML/blob/main/llama-13b.ggmlv3.q4_0.bin)) and get it running for yourself on http://127.0.0.1:7860/, before you can run it inside of smol menubar (since we just embed the UI). However currently the app crashes when a click is simulated.
- **New Chats**: To start a new conversation, cmd+R (simple window refresh, nothing special)

## video demo

- original version https://youtu.be/jrlxT1K4LEU
- Jun 1 version https://youtu.be/ThfFFgG-AzE
- https://twitter.com/swyx/status/1658403625717338112
- https://twitter.com/swyx/status/1663290955804360728?s=20
- July 11 version https://twitter.com/swyx/status/1678944036135260160


## Download and Setup

You can download the precompiled binaries for MacOS: https://github.com/smol-ai/menubar/releases/latest (sometimes Apple marks these as untrusted/damaged, just open them up in Applications and right-click-open to run it. Or run it from source (instructions below)

The first run creates a desktop shortcut. After the initial setup, you can simply use the generated desktop file to start the application in the future.

When you first run the app: 

1. log into your Google account (once you log into your google account for chatgpt, you'l also be logged in to Bard). 
2. For Bing, after you log in to your Microsoft account, you'll need to refresh to get into the Bing Chat screen. It's a little finnicky at first try but it works.
3. Login for Anthropic via Google SSO is broken right now - it requires a popup which is blocked at least in my testing. For now just use manual email + login token, it works fine (dont include the extra space at the end from their email!!). If you are familiar with Electron and Webviews, would welcome a PR to fix, we can't figure it out so far.

![image](https://github.com/smol-ai/menubar/assets/6764957/dce5b127-e8c2-4be2-97d3-e2fa3042ef24)

## seeking contributors!

please see https://github.com/smol-ai/menubar/blob/main/CONTRIBUTING.md

## build from source

If you want to build from source, you will need to clone the repo and open the project folder:

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/smol-ai/menubar.git
   cd menubar
   npm install
   # On Windows, you may also need Squirrel:
   # npm install electron-squirrel-startup
   ```

2. Generate binaries:

   ```bash
   npm run make # or npm run build. # npm run buildAndSign is for swyx to publish the official codesigned and notarized releases
   ```

   The outputs will be located in the `/out/make` directory. Note that it will start minimized in your taskbar; you'll need to click the icon to use it:

![image](images/minimized.jpg)

## windows/linux builds

by default we're mac only - i only have a mac sorry. (we are seeking a "Windows Maintainer"! and someone to help make this work on Arch Linux)

i think you can run

```bash
electron-forge make --platform=win32 --arch=ia32,x64
```

and it might work? let us know and i'd happily take a PR to include it in the default `make` process.

## why use/make this?

Google [dropped its waitlist for Bard recently](https://www.theverge.com/2023/5/10/23718066/google-bard-ai-features-waitlist-dark-mode-visual-search-io), so now there is some reason to try it out.

People have bad first impressions on Bard, but in May 2023 it has been receiving some positive feedback:

- https://twitter.com/masadfrost/status/1655802654927507457?s=46&t=90xQ8sGy63D2OtiaoGJuww

- https://twitter.com/amasad/status/1657510601202221056?s=46&t=90xQ8sGy63D2OtiaoGJuww

these folks aren't neutral, but its clear of course that Bard will be better for some things than others, and we might as well lower the barrier for trying them out.

then anthropic dropped 100k context, and at that point i was convinced i need to be A/B testing all 3 to get the benefits/get an intuition of what they each are best at.

## Related project

I only later heard about https://github.com/sunner/ChatALL which is cool but I think defaulting to a menbuar/webview experience is better - you get to use full features like Code Interpreter and Claude 2 file upload when they come out, without waiting for API

