# smol menubar

This is a smol menubar app that helps you quickly access ChatGPT, Bard, and Anthropic with a single keyboard shortcut.

![image](https://github.com/smol-ai/menubar/assets/6764957/753c6128-d978-4bb4-8642-588d42121ff5)

whatever is typed at the bottom is entered into all 3 windows simultaneously, however if you wish to explore one further than the other you can do so independently since they are just webviews. 

so for example you can use chatgpt plugins despite there not being an api for them. or you can use bard/anthropic without needing api access.

## video demo

- https://youtu.be/jrlxT1K4LEU
- https://twitter.com/swyx/status/1658403625717338112

## install

either download the precompiled binaries: https://github.com/smol-ai/menubar/releases/tag/v0.0.3

or build from source (see below)

then log into your google account (either will do, both rely on google login)
![image](https://github.com/smol-ai/menubar/assets/6764957/dce5b127-e8c2-4be2-97d3-e2fa3042ef24)

dont worry i dont track anything. inspect and build from source if you wish.

## usage

I usually just always press Cmd+Shift+G -> quick open to use it. You can modify this keyboard shortcut if you build it from source.

Login for Anthropic via Google SSO is broken right now - it requires a popup which is blocked at least in my testing. Would welcome a PR to fix that, but otherwise regular email + login token works fine.

you can resize the overall window with a click n drag. Cmd+1/2/3/A or drag to resize the internal webviews as you wish.

to start a new conversation, cmd+R (simple window refresh, nothing special)

## build from source

```bash
npm run make # or npm run build
```

outputs to `/out/make`

## why

Google [dropped its waitlist for Bard recently](https://www.theverge.com/2023/5/10/23718066/google-bard-ai-features-waitlist-dark-mode-visual-search-io), so now there is some reason to try it out.

People have bad first impressions on Bard, but in May 2023 it has been receiving some positive feedback:

[![image](https://github.com/smol-ai/menubar/assets/6764957/0d86234e-1d91-4863-8311-580888511b20)](https://twitter.com/masadfrost/status/1655802654927507457?s=46&t=90xQ8sGy63D2OtiaoGJuww)

[![image](https://github.com/smol-ai/menubar/assets/6764957/e191701a-0b32-43aa-abc0-42e6fd9584aa)](https://twitter.com/amasad/status/1657510601202221056?s=46&t=90xQ8sGy63D2OtiaoGJuww)

these folks aren't neutral, but its clear of course that Bard will be better for some things than others, and we might as well lower the barrier for trying them out.

## help needed

- i need a new set of icons for the images
- better styling for the window? maybe normalize the bard window to the openai dimensions?
- switch the superprompt from an input to a textarea... but make it easy to submit - by cmd + enter?
