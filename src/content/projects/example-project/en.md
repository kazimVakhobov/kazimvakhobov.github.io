---
# ШАБЛОН. Как добавить проект:
#   1. cp -r src/content/projects/example-project src/content/projects/<slug>
#   2. заполнить en.md / ru.md / uz.md (можно начать только с en.md — остальные подхватят английский)
#   3. draft: false, когда готово
# Папка называется так же, как будет в адресе: /projects/<slug>/
lang: en
draft: true

title: Example Project
tagline: One sentence about what it does and for whom.
kicker: Open source

# cover: ./cover.png        # картинку положить рядом с этим файлом
# coverAlt: Screenshot of the CLI

order: 10
featured: true

period: 2024 — now
status: active
license: MIT

tags:
  - CLI
  - TypeScript

stack:
  - name: Core
    items: [TypeScript, Node.js]
  - name: Tooling
    items: [Vitest, GitHub Actions]

links:
  - label: Source code
    href: https://github.com/
    icon: github
    primary: true
  - label: Live demo
    href: https://example.com
    icon: demo

# media:
#   - type: image
#     src: /projects/example/screen-1.png     # файлы из public/
#     alt: Main screen
#     caption: Main screen
#     ratio: 16/9
#   - type: video
#     src: /projects/example/demo.mp4
#     ratio: 16/10
#   - type: iframe
#     src: https://example.com/embed
#     ratio: 4/3

stats:
  - value: "—"
    label: GitHub stars
  - value: "—"
    label: Downloads / month

role: What exactly I did — author, maintainer, main contributor.
---

## Problem

What was broken or missing before this project existed.

## Solution

How it works in two or three sentences, and what makes the approach different.

## Key features

- First thing it does well
- Second thing
- Third thing

## Architecture

How the parts fit together. A diagram image works well here.

## Quick start

```bash
npm install example-project
npx example-project --help
```

## What I learned

- Something non-obvious that came out of building this
