---
draft: false

title: GREEN-API Telegram client
tagline: A web chat that sends and receives Telegram messages through GREEN-API, modelled on web.telegram.org.
kicker: Open source · React + TypeScript

order: 30
featured: false

period: "2026"
status: maintained
license: MIT

tags:
  - React
  - TypeScript
  - Integration

stack:
  - name: Client
    items: [React, TypeScript, Vite]
  - name: Integration
    items: [GREEN-API HTTP API, long polling, localStorage]
  - name: Delivery
    items: [GitHub Pages]

links:
  - label: Source code
    href: https://github.com/kazimVakhobov/green-api-test-app
    icon: github
    primary: true
  - label: Live demo
    href: https://kazimvakhobov.github.io/green-api-test-app/
    icon: demo

media:
  - type: iframe
    src: https://kazimvakhobov.github.io/green-api-test-app/
    alt: GREEN-API Telegram client
    caption: The live demo, running on GitHub Pages
    ratio: 16/10

role: Author. Full implementation.
---

## Problem

Messenger provider APIs give you sending and receiving as raw HTTP calls and
nothing else — no session, no chat list, no history. Everything a user thinks
of as "a messenger" has to be built on the client side on top of a handful of
stateless endpoints.

## Solution

A React chat on GREEN-API's HTTP API, with an interface modelled on
web.telegram.org so there is nothing to learn. Sign in with instance
credentials, start a chat by phone number, send text, receive replies through
long polling.

The assignment proposed a different messenger, which I had no access to — so,
as the brief allowed, this is the Telegram variant. GREEN-API's shape is the
same across messengers; switching mainly changes the `apiUrl` host.

## Key features

- Sign-in with `idInstance` and `apiTokenInstance`, verified against
  `getStateInstance` before anything else happens.
- Starting a chat by the recipient's phone number.
- Sending text through `SendMessage`.
- Receiving through `ReceiveNotification` / `DeleteNotification` long polling.
- Chats and history persisted in `localStorage`.
- A warning when incoming notifications are switched off in the instance
  settings, with a button that switches them on — the failure that otherwise
  looks like "the app does not receive messages".
- Responsive layout for mobile.

## Quick start

```bash
git clone https://github.com/kazimVakhobov/green-api-test-app.git
cd green-api-test-app
npm install
npm run dev
```

Node 20+. Open <http://localhost:5173>.
