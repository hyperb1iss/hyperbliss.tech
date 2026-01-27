---
emoji: '⚡'
title: 'q: The Tiniest Claude Code CLI'
description:
  'A minimal, elegant CLI for Claude. Ask, pipe, chat—one letter, infinite
  answers.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/q'
tags: ['TypeScript', 'Bun', 'Claude', 'CLI', 'AI', 'Developer Tools']
---

## 💎 Overview

**q** is a minimal, elegant CLI for Claude. Ask your question, get back to work.
One letter. Infinite answers.

## 🌀 Modes

| Mode            | Trigger                   | What It Does                           |
| --------------- | ------------------------- | -------------------------------------- |
| **Query**       | `q "question"`            | Quick answer, streamed to terminal     |
| **Pipe**        | `cat file \| q "convert"` | Transform piped content, raw output    |
| **Interactive** | `q -i`                    | TUI chat with full context             |
| **Agent**       | `q -x "task"`             | Execute with tools (read, write, bash) |

## ⚡ Quick Start

```bash
# Install
npm i -g @hyperb1iss/q

# Set your API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Ask anything
q "how do I find large files in this directory"
```

## 🔀 Pipe Mode

A true Unix pipeline citizen. Pipe content in, get raw output back.

```bash
# Transform data formats
cat config.yaml | q "convert to json" > config.json

# Extract information
cat server.log | q "extract all IP addresses" | sort -u

# Analyze and chain
git diff | q "summarize" | q "translate to spanish"
```

## 🦋 Shell Integration

```bash
# Add to your shell config
eval "$(q --shell-init zsh)"
```

This gives you `qq`, `qctx`, `qerr`, `qx`, `qr`, and Ctrl+Q for quick queries
with context from your last command or error.

## 🤖 Agent Mode

Let Claude execute tools to complete tasks with intelligent approval prompts:

```bash
q -x "find all TODO comments in this project"
q -x "refactor this function to use async/await"
```

---

Minimal by design. Powerful by default.
