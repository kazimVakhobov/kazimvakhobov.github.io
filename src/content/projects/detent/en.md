---
lang: en
draft: true

title: detent
tagline: Autonomy bounded by a machine-checkable gauge, and measured.
kicker: Open source · developer tooling

order: 10
featured: true

period: 2026 — now
status: wip
license: MIT

tags:
  - Developer tooling
  - CLI
  - Node.js
  - Coding agents

stack:
  - name: Core
    items: [Node.js 22, JavaScript, Git plumbing]
  - name: Interface
    items: [CLI, product.json, JSONL journal]
  - name: Method
    items: [Spec-driven delivery, ADR, machine-checked gauge]

links:
  - label: Source code
    href: https://github.com/kazimVakhobov/detent
    icon: github
    primary: true
  - label: npm package
    href: https://www.npmjs.com/package/@kazimvakhobov/detent
    icon: npm
  - label: DESIGN.md
    href: https://github.com/kazimVakhobov/detent/blob/main/DESIGN.md
    icon: docs

stats:
  - value: "0.0.1"
    label: published, name held
  - value: "9"
    label: preconditions checked by doctor
  - value: "8"
    label: decisions recorded as ADRs

role: Author. Design, specification and implementation.
---

## Problem

A coding agent decides for itself when it is finished. It says "done", and the
only thing standing between that claim and the main branch is a person reading
a diff. Two things follow from that, and both of them hurt at scale: work that
does not actually pass the project's own checks still gets offered as complete,
and nobody can say what any of it cost — which model, how many attempts, how
long, how much money.

## Solution

A detent is the catch that holds a mechanism in a defined position until it is
deliberately released. Here it is released by a green gauge — the project's own
checks — and by nothing else.

The gauge runs on the agent's way out. Red means it does not get to leave, and
it is handed the failure text to work from. Three identical failures in a row
is an escalation to a person, not a fourth attempt. **The constraints are in the
code, not in the prompt.**

Every run is a line in a journal: which model, how many times it hit red, which
stage it died on, how long, how much. That turns "which model should run this
repository" from an opinion into a number.

## The line agents do not cross

```
       human                   │                     agents
  ─────────────────────────────┼──────────────────────────────────────────
  dev → staging → main         │   agent/task-<id>-<slug>
  feature/*, hotfix/*          │         │ merge, when the gauge is green
                               │         ▼
                               │   agent/dev
                               │         │ promote, when the batch is green
                               │         ▼   (optional)
                               │   agent/staging
                               │
  dev → agent/dev  ────────────┼──→  here is my work, take it into account
  agent/staging → dev  ←───────┼───  I accept yours
```

detent reads and writes refs under `refs/heads/agent/` and nothing else — one
namespace, one predicate, one glob to audit it with. Both gates between the
territories are human operations, in both directions. It refuses to start on a
dirty tree and never moves a ref outside its own namespace.

`agent/staging` exists for one reason: the per-task gauge checks a task, and
what actually breaks is the combination. The batch gauge runs there, and how
often a batch came out red after every task in it was green is itself a number
detent reports.

## Where the boundary is

The acceptance pass runs on a second model and can **demote, never approve**.
Green is granted by machine checks; a model's judgement may only raise a doubt
and send the task to a person. Without that rule, "proven" quietly becomes
"a second model agreed" — which is a different and much weaker claim.

## Opinionated on purpose

It expects a product shaped a particular way and says so instead of adapting to
everything: real git rather than a shallow clone, repositories side by side in
one folder, one human branch per repository to compare against, a gauge declared
as named stages runnable locally, a clean tree at the start, an authenticated
agent CLI, an integration branch that is never deployed, one person per
workspace, macOS or Linux with Node 22.

`detent doctor` checks all nine and tells you what to change.

## Status

Version 0.0.1 is the name and nothing behind it — published to hold the name
while the tool is built. `DESIGN.md` is the specification the code is being
written against, and it was written before the code rather than after it, which
is also how detent expects tasks to be written.

The repository is built by the method the tool enforces: nothing reaches `dev`,
`staging` or `main` except through a pull request with a green gauge, and every
decision is recorded with the alternative it displaced and what that cost.
