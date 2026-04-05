---
emoji: '🧠'
title: 'hyperskills: AI Agent Skills That Actually Work'
description:
  'Ten focused skills for Claude Code and Codex, distilled from thousands of
  real sessions. Process workflows, multi-agent orchestration, security ops, and
  domain-specific decision trees.'
date: '2026-02-01'
github: 'https://github.com/hyperb1iss/hyperskills'
tags:
  [
    'AI',
    'Claude Code',
    'Agent Skills',
    'Developer Tools',
    'Orchestration',
    'Python',
    'TypeScript',
  ]
---

Models already know how to write React components and Kubernetes manifests. They
don't need 300 lines of examples for that.

hyperskills provides skills for things that are genuinely hard to get right
without guidance: procedural knowledge from thousands of real sessions, decision
trees for high-stakes operations, and multi-agent orchestration patterns that
work in production. Ten skills. Zero bloat.

## ✦ The Pipeline

```
brainstorm → research → plan → implement → codex-review
                                    ↓
                               orchestrate (parallel agents)
```

| Scenario              | Flow                                                  |
| --------------------- | ----------------------------------------------------- |
| New feature           | `brainstorm` → `plan` → `implement` → `codex-review`  |
| Greenfield project    | `brainstorm` → `research` → `plan` → `orchestrate`    |
| Bug fix               | `implement` (scale selection handles the rest)        |
| Architecture decision | `brainstorm` → `research` → decide                    |
| Large refactor        | `plan` → `orchestrate` → `implement` → `codex-review` |

Start wherever makes sense. Each skill has built-in scale selection.

## 🔧 Process Skills

- **brainstorm**: Double Diamond ideation with Council pattern for architectural
  decisions
- **research**: Wave-based multi-agent knowledge gathering with deferred
  synthesis
- **plan**: Verification-driven task decomposition with dependency ordering
- **implement**: The core coding skill, distilled from 21,000+ tracked
  operations across 64 projects
- **orchestrate**: Six multi-agent coordination strategies from 597+ real
  dispatches
- **codex-review**: Cross-model review (Claude writes, Codex reviews, no
  self-approval bias)

## 🎯 Domain Skills

- **security**: STRIDE, Zero Trust, OWASP Top 10, SLSA, incident response,
  compliance frameworks
- **git**: Decision trees for rebases, lock file conflicts, SOPS resolution,
  archaeology
- **tui-design**: 3,000-line TUI design knowledge base covering layout, color
  theory, interaction patterns
- **uv**: Current docs for Astral's Python toolchain (uv, ruff, ty)

## 📦 Install

```bash
# Claude Code plugin
/plugin install hyperskills

# skills.sh
npx skills add hyperbliss/hyperskills --all

# Pick individual skills
npx skills add hyperbliss/hyperskills --skill implement
```

---

**Skills for things models don't already know.**
