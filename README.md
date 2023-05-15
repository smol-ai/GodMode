# smol menubar

This is a smol menubar app that helps you quickly access both openai chatgpt and google bard with a single keyboard shortcut.

![image](https://github.com/smol-ai/menubar/assets/6764957/cb7ad970-d109-41d4-aae1-789a02bb401b)

whatever is typed at the top is entered into both chatgpt and bard simultaneously, however if you wish to explore one further than the other you can do so independently since they are just webviews.

you can access the full power of each since they are both just webviews, so for example you can use chatgpt plugins despite there not being an api for them.

## install

either download the precompiled binaries: https://github.com/smol-ai/menubar/releases/tag/v0.0.1

or build from source (see below)

then log into your google account (either will do, both rely on google login)
![image](https://github.com/smol-ai/menubar/assets/6764957/dce5b127-e8c2-4be2-97d3-e2fa3042ef24)

dont worry i dont track anything. inspect and build from source if you wish.

## usage

I usually just always press Cmd+Shift+G -> quick open

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
- need help to put the joint input at the bottom instead of the top
