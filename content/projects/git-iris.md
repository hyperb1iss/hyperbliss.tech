---
emoji: '🔮'
title: 'Git-Iris: Your Agentic Git Companion'
description:
  'An intelligent agent that understands your code and crafts perfect Git
  artifacts—commits, reviews, changelogs, and more.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/git-iris'
tags:
  [
    'Rust',
    'Git',
    'AI',
    'CLI',
    'Developer Tools',
    'OpenAI',
    'Anthropic',
    'GitHub Action',
  ]
---

## 💜 Overview

Git-Iris is powered by **Iris**, an intelligent agent that actively explores
your codebase to understand what you're building. Rather than dumping context
and hoping for the best, Iris uses tools to gather precisely the information she
needs—analyzing diffs, exploring file relationships, and building understanding
iteratively.

## 🪄 What Iris Can Do

| Capability             | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| ✍️ **Commit Messages** | Context-aware messages that capture the essence of your changes |
| 🔬 **Code Reviews**    | Multi-dimensional analysis covering security and performance    |
| 📜 **Pull Requests**   | Comprehensive PR descriptions for branches or commits           |
| 🗂️ **Changelogs**      | Keep a Changelog format with intelligent categorization         |
| 🎊 **Release Notes**   | User-focused documentation highlighting impact and benefits     |
| 🔭 **Semantic Blame**  | Ask "why does this code exist?" and get real answers            |

## 🌌 Iris Studio

**Studio** is a stunning terminal interface built with the **SilkCircuit Neon**
design language. Press `/` to chat with Iris, ask her to refine your commit
message or explain changes—she can update content directly through intelligent
tool calls!

## 📦 Installation

```bash
# Quick install
curl -fsSL https://raw.githubusercontent.com/hyperb1iss/git-iris/main/install.sh | sh

# Homebrew
brew tap hyperb1iss/tap && brew install git-iris

# Cargo
cargo install git-iris
```

## 🚀 Quick Start

```bash
# Launch Studio (auto-detects context)
git-iris

# Generate commit messages
git add . && git-iris gen

# Review code
git-iris review --from main --to feature

# Generate changelogs
git-iris changelog --from v1.0.0 --update

# PR descriptions
git-iris pr --from main --to feature-branch
```

## 🤖 GitHub Action

Automate release notes and changelogs in your CI/CD:

```yaml
- name: Generate release notes
  uses: hyperb1iss/git-iris@v1
  with:
    from: v1.0.0
    to: v1.1.0
    api-key: ${{ secrets.OPENAI_API_KEY }}
    output-file: RELEASE_NOTES.md
```

## 🎨 Multi-Provider Support

Supports **OpenAI**, **Anthropic**, and **Google** AI providers. Configure once:

```bash
git-iris config --provider anthropic --api-key YOUR_API_KEY
```

---

**An intelligent agent that understands your code.**
