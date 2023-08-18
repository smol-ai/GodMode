# GodMode - the smol AI Chat Browser

This is a dedicated chat browser that only does one thing: help you quickly access **the full webapps** of ChatGPT, Claude 2, Perplexity, Bing and more **with a single keyboard shortcut (Cmd+Shift+G)**.

![image](https://github.com/smol-ai/menubar/assets/6764957/90f4bab4-e406-4507-b37e-8c8d80d18f15)

([click for video demo](https://twitter.com/swyx/status/1678944036135260160))

Whatever is typed at the bottom is entered into all **web apps** simultaneously, however if you wish to explore one further than the other you can do so independently since they are just webviews. [See video demo](https://www.youtube.com/watch?v=wCGe3_L5a30)

## Mixture of Mixture of Experts

It's well discussed by now that [GPT4 is a mixture of experts model](https://twitter.com/swyx/status/1671272883379908608), which explains its great advancement over GPT3 while not sacrificing speed. It stands to reason that if you can run one chat and get results from all the top closed/open source models, you will get that much more diversity in results for what you seek. As a side benefit, we will add opt-in data submission soon so we can crowdsource statistics on win rates, niche advantages, and show them over time.

> “That's why it's always worth having a few philosophers around the place. One minute it's all is truth beauty and is beauty truth, and does a falling tree in the forest make a sound if there's no one there to hear it, and then just when you think they're going to start dribbling one of 'em says, incidentally, putting a thirty-foot parabolic reflector on a high place to shoot the rays of the sun at an enemy's ships would be a very interesting demonstration of optical principles.”
>
> ― [Terry Pratchett, Small Gods](https://www.goodreads.com/work/quotes/1636629-small-gods)

## Oh so this is like nat.dev?

Yes and no:

1. SOTA functionality is often released without API (eg: ChatGPT Code Interpreter, Bing Image Creator, Bard Multimodal Input, Claude Multifile Upload). **We insist on using webapps** so that you have full access to all functionality on launch day. We also made light/dark mode for each app, just for fun (`Cmd+Shift+L`)
2. This is a menubar app that can be invoked with a keyboard shortcut (Cmd+Shift+G). Feels a LOT faster than having it live in a browser window somewhere and is easy to pull up/dismiss during long generations.
3. Supports local models like LLaMa and Vicuna via [OobaBooga](https://github.com/oobabooga/text-generation-webui).
4. No paywall, build from source.

## Supported LLM Providers

| Provider (default in **bold**)                                                          | Notes                                                                                                                                        |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **ChatGPT**                                                                             | Defaults to "[GPT4.5](https://www.latent.space/p/code-interpreter#details)"!                                                                                                           |
| **Claude 2**                                                                            | Excellent, long context, multi document, fast model.  |
| **Perplexity**                                                                          | The login is finnicky - login to Google on any of the other chats, and then reload (cmd+R) - it'll auto login. Hopefully they make it more intuitive/reliable in future.                                                                                                                                |
| **Bing**                                                                                | Microsoft's best. [It's not the same as GPT-4!](https://twitter.com/jeremyphoward/status/1666593682676662272?s=20). We could use help normalizing its styling.                           |
| Bard                                                                                    | Google's best. [Bard's updates are... flaky](https://twitter.com/swyx/status/1678495067663925248)                                            |
| Quora Poe                                                                               | Added in #118                                                                                                                                |
| HuggingChat                                                                         | Offers Llama2, OpenAssistant                                                                                                                 |
| Vercel Chat                                                                             | Added in #117                                                                                                                                |
| Local/GGML Models (via [OobaBooga](https://github.com/oobabooga/text-generation-webui)) | Requires Local Setup, see oobabooga docs                                                                                                                         |
| Phind                                                                                   | Developer focused chat (temporarily disabled)                                                                                                                       |
| OpenAssistant                                                                           | Coming Soon — [Submit a PR](https://github.com/smol-ai/menubar/issues/37)!                                                                   |
| Claude 1                                                                                  | Requires Beta Access                                                                                                                         |
| ... What Else?                                                                        | [Submit a New Issue](https://github.com/smol-ai/menubar/issues)!                                                                             |

## Features and Usage

- **Keyboard Shortcuts**:

  - Use `Cmd+Shift+G` for quick open and `Cmd+Enter` to submit.
  - Customize these shortcuts (thanks [@davej](https://github.com/smol-ai/menubar/pull/85)!):
    - Quick Open
      - ![image](https://github.com/davej/smol-ai-menubar/assets/6764957/3a6d0a16-7f54-43e5-9060-ec7b2486d32d)
    - Submit can be toggled to use `Enter` (faster for quick chat replies) vs `Cmd+Enter` (easier to enter multiline prompts)
  - `Cmd+Shift+L` to toggle light/dark mode (not customizable for now)
  - Remember you can customize further by building from source!

- **Pane Resizing and Rearranging**:

  - Resize the panes by clicking and dragging.
  - Use `Cmd+1/2/3` to pop out individual webviews
  - Use `Cmd +/-` to zoom in/out globally
  - open up the panel on the bottom right to reorder panes or reset them to default
  - `Cmd p` to pin/unpin the window Always on Top

- **Model Toggle**:

  - Enable/disable providers by accessing the context menu. The choice is saved for future sessions.
  - Supported models: ChatGPT, Bing, Bard, Claude 1/2, and more (see Supported LLM Providers above)

- **Support for oobabooga/text-generation-webui**:

  - Initial support for [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui) has been added.
  - Users need to follow the process outlined in the text-generation-webui repository, including downloading models (e.g. [LLaMa-13B-GGML](https://huggingface.co/TheBloke/LLaMa-13B-GGML/blob/main/llama-13b.ggmlv3.q4_0.bin)).
  - Run the model on `http://127.0.0.1:7860/` before running it inside of the smol menubar.
  - The UI only supports one kind of prompt template. Contributions are welcome to make the templating customizable (see the Oobabooga.js provider).

- **Starting New Conversations**:
  - Use `Cmd+R` to start a new conversation with a simple window refresh.

## video demo

- original version https://youtu.be/jrlxT1K4LEU
- Jun 1 version https://youtu.be/ThfFFgG-AzE
- https://twitter.com/swyx/status/1658403625717338112
- https://twitter.com/swyx/status/1663290955804360728?s=20
- July 11 version https://twitter.com/swyx/status/1678944036135260160
- Aug 15 version https://twitter.com/swyx/status/1692351633681011018

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
   # On Windows, you may also need Squirrel - these are old instructions, we would love help to verify
   # npm install electron-squirrel-startup

   npm run start # to run in development, locally
   ```

2. Generate binaries:

   ```bash
   npm run package # https://electron-react-boilerplate.js.org/docs/packaging
   # ts-node scripts/clean.js dist clears the webpackPaths.distPath, webpackPaths.buildPath, webpackPaths.dllPath
   # npm run build outputs to  /release/app/dist/main
   # electron-builder build --publish never builds and code signs the app.

   # this is mostly for swyx to publish the official codesigned and notarized releases
   ```

   The outputs will be located in the `/release/build` directory.

## windows/linux builds

by default we're mac only - i only have a mac sorry. (we are seeking a "Windows Maintainer"! and someone to help make this work on Arch Linux)

Please let usknow if you hvave windows/linux instructions.

## Related project

I only later heard about https://github.com/sunner/ChatALL which is cool but I think defaulting to a menbuar/webview experience is better - you get to use full features like Code Interpreter and Claude 2 file upload when they come out, without waiting for API
