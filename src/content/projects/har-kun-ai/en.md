---
lang: en
draft: true

title: Har Kun
tagline: A streaming chat with a language model that can be cut off mid-sentence without losing what already arrived.
kicker: Open source · React + TypeScript

order: 20
featured: true

period: "2026"
status: maintained
license: MIT

tags:
  - React
  - TypeScript
  - LLM
  - Accessibility

stack:
  - name: Client
    items: [React, TypeScript, Vite, SSE]
  - name: Server
    items: [Node.js, Express, OpenRouter API]
  - name: Testing
    items: [Vitest, mock-first development]

links:
  - label: Source code
    href: https://github.com/kazimVakhobov/har-kun-ai
    icon: github
    primary: true
  - label: Decision records
    href: https://github.com/kazimVakhobov/har-kun-ai/tree/master/docs/adr
    icon: docs

stats:
  - value: "164"
    label: tests
  - value: "16"
    label: decisions recorded as ADRs
  - value: "0"
    label: secrets in the client bundle

role: Author. Full stack, from the SSE contract to the design system.
---

## Problem

Streaming a model's answer into a browser looks like a small job until the
failures start. The answer has to appear as it is written and stop on command
without losing what already arrived. The API key must never reach the browser.
And once the first token has been sent, HTTP can no longer change the status
code — so an error halfway through an answer cannot be a 502.

## Solution

React and TypeScript on the front, a small Express proxy behind it so the
OpenRouter key never leaves the server. The browser only ever talks to its own
origin.

**It runs with no key at all.** Without `OPENROUTER_API_KEY` the server starts
on a mock that imitates a live model — random length and speed, markdown,
ragged frames, and failures on demand. The whole interface was built against
it, so a reviewer can see everything working without creating an account.

## Key features

- **Streaming** over SSE, with text appearing as it is generated.
- **Stop** — the button or `Esc`. The received part stays in history, the
  interface stays alive, and the next message sends immediately.
- **Every failure ends in a readable state** — 429 with a countdown when the
  upstream names one, timeouts, a dropped connection, an error mid-answer.
  No permanent spinner, and a partial answer is never thrown away.
- **Keyboard throughout** — Tab, Enter sends, Shift+Enter breaks a line, Esc
  stops, a skip link, semantic markup, one polite live region.
- **Markdown** rendered live, with unterminated code fences closed before parsing.
- **A free model picker** filled from OpenRouter's live catalogue filtered to `:free`.

## Decisions that shaped the code

**The key lives only on the server.** It is read from `process.env` inside
`server/` and never leaves it. Worth naming the trap avoided: Vite's
`import.meta.env` with a `VITE_` prefix is one line away and inlines the value
into the bundle — exactly the place it must stay out of. `grep` over the built
`dist/` finds neither `openrouter` nor `Bearer`.

**Our own SSE shape rather than piping the upstream.** HTTP cannot change a
status once headers are sent, so an error after the first token has to be an
event inside a 200. The contract therefore has two error forms and the server
owns the decision about which applies. Piping the provider through would have
handed that decision to the client.

**The mock came first and stayed.** A 429 from a free model arrives when it
arrives; a dropped connection has to be staged. `?simulate=` makes each one a
single URL. The cost is a contract kept in sync between two implementations —
which is why it is written down.

**History survives a reload and dies with the tab.** `sessionStorage` puts the
boundary where the user's own mental boundary already is: a stray F5 costs
nothing, closing the tab clears everything, and no "clear history" button has
to be designed, explained and remembered. A message caught mid-stream is
restored as *stopped*, never as streaming.

**The model list is fetched, not pinned.** The catalogue read while building
this had 460 models, 16 of them free, and not one of the sixteen is promised to
still be free next month. A hard-coded list fails in the worst way: the picker
looks fine while every model in it returns 404.

## The pushback

The assignment asked for full keyboard operability and, separately, for the
browser's focus outline to be removed because it looks inconsistent across
browsers. Taken literally, the second requirement deletes the first: the focus
ring is the only thing that shows where you are during keyboard navigation, so
Tab moves blind and Enter submits something you cannot see.

The diagnosis behind the request was correct, though — default rings genuinely
do differ in every browser. So the intent was satisfied rather than the letter:
the browser outline is gone, and every interactive element carries its own ring
instead, identical everywhere and defined by the design system.

## Quick start

```bash
npm install
npm run dev          # Vite on :5173, backend on :8787
```

Node ≥ 20.19, built and tested on 22. `MOCK=1` forces the mock even with a key;
`MOCK=0` without a key is a server that refuses to start and says why, rather
than one that looks healthy and fails on the first question.
