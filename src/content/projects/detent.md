---
draft: false

title: detent
tagline: Autonomy bounded by a machine-checkable gauge, and measured.
kicker: Open source · developer tooling

order: 10
featured: true

period: 2026 — now
updated: 2026-10-26
status: active
license: MIT

tags:
  - Developer tooling
  - CLI
  - Node.js
  - Coding agents

stack:
  - name: Core
    items: [Node.js 22, JavaScript, Git plumbing, zero dependencies]
  - name: Interface
    items: [CLI, local dashboard, product.json, JSONL journal]
  - name: Method
    items: [Spec-driven delivery, ADR, machine-checked gauge]

links:
  - label: Source code
    href: https://github.com/kazimVakhobov/detent
    icon: github
    primary: true
  - label: Live dashboard demo
    href: https://detent.kazimvakhobov.com/demo/
    icon: demo
  - label: Project site
    href: https://detent.kazimvakhobov.com/
    icon: external
  - label: npm package
    href: https://www.npmjs.com/package/@kazimvakhobov/detent
    icon: npm
  - label: DESIGN.md
    href: https://github.com/kazimVakhobov/detent/blob/main/DESIGN.md
    icon: docs

stats:
  - value: "0.9.0"
    label: published, every command working
  - value: "72%"
    label: pass rate across 39 recorded runs
  - value: "22%"
    label: of green runs the reviewer demoted
  - value: "$10.52"
    label: cost per task that landed

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

detent dispatches Claude Code at a queue of tasks, one at a time. The gauge runs
on the agent's way out. Red means it does not get to leave, and it is handed the
failure text to work from. Three rounds by default, then the task is parked for
a person rather than attempted a fourth time. **The constraints are in the code,
not in the prompt.**

Every run is a line in a journal: which model, how many rounds it took, which
stage it died on, how long, how much. That turns "which model should run this
repository" from an opinion into a number.

A task is a markdown file, and only its body reaches the agent — the
specification written before the work *is* the prompt. The queue is four
folders, and the folder a file sits in is its state: `todo`, `hold`, `done`,
`failed`. detent moves a file out of `todo` and nowhere else; every other move
is a person's.

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

Nothing inside a repository of your product is ever pushed — not `agent/dev`,
not a tag. Pushing is a person's move.

## Where the boundary is

The acceptance pass runs on a second model and can **demote, never approve**.
Green is granted by machine checks; a model's judgement may only raise a doubt,
which costs the agent one of its rounds and, on the last one, sends the task to
a person. Without that rule, "proven" quietly becomes "a second model agreed" —
which is a different and much weaker claim.

## It builds itself, and that is where the numbers come from

Since 13 October 2026 the tasks in this repository have been dispatched by
`detent run`, held behind the gauge, read by the acceptance pass and merged by
the tool. The git trailers are the record, and nobody typed them by hand.

| From the repository's own journal | |
| --- | --- |
| Runs recorded | 39 |
| Pass rate | 72% |
| Cost per task that landed | $10.52 |
| Green runs the reviewer read | 36 |
| …of those, demoted | 22% |

The last row is the number the whole product exists to produce: **almost a
quarter of the runs whose machine checks were green had not actually done the
task.** Each one is an hour of a person's attention that a passing test suite
would have told nobody about.

## The dashboard

`detent dashboard` watches a run while it happens — what the agent is saying as
it says it, what each round of each task did and what it cost, and the
configuration, which it writes back between runs. It listens on `127.0.0.1` only
and loads nothing from anywhere else.

## Opinionated on purpose

It expects a product shaped a particular way and says so instead of adapting to
everything: real git rather than a shallow clone, repositories side by side in
one folder, one human branch per repository to compare against, a gauge declared
as named stages runnable locally, a clean tree at the start, an agent CLI
installed and authenticated, an integration branch that is never deployed, one
person per workspace, macOS or Linux with Node 22.

`detent doctor` checks all nine and tells you what to change.

## Status

Version 0.9.0 is published, with every command in `detent --help` doing
something: `doctor`, `init`, `plan`, `run`, `promote`, `summary`, `dashboard`,
`gauge`, `recover`, `prune`. Zero dependencies — it drives the agent you already
pay for and ships none of its own. What 1.0.0 still wants is a real batch of
tasks run against a product that is not this one.

`DESIGN.md` is the specification the code is written against, and it was written
before the code rather than after it, which is also how detent expects tasks to
be written. Twenty-six decisions are recorded as ADRs, each with the alternative
it displaced and what that cost.
