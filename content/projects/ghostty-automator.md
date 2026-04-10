---
emoji: '🎭'
title: 'Ghostty Automator: Playwright for Terminals'
description:
  'Playwright-style terminal control for Ghostty. Async-first Python API with
  assertions, auto-waiting, and screenshot capture.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/ghostty-automator-python'
tags: ['Python', 'Ghostty', 'Terminal', 'Automation', 'Testing', 'asyncio']
---

## Overview

**ghostty-automator** brings Playwright-style terminal automation to Ghostty. Familiar, ergonomic API for controlling terminal sessions programmatically.

## Features

- **Playwright-style API**: Familiar, ergonomic interface
- **Async-first**: Built on anyio for high performance with sync wrapper
- **Strong typing**: Full type hints with strict pyright compliance
- **Auto-waiting**: Built-in wait helpers with configurable timeouts
- **Assertions**: Playwright-style `expect` for testing
- **Screenshots**: Capture terminal state as PNG images

## Quick Start

```python
from ghostty_automator import Ghostty

async with Ghostty.connect() as ghostty:
    terminal = await ghostty.terminals.first()

    # Send commands
    await terminal.send("ls -la")

    # Wait for output
    await terminal.wait_for_text("package.json")

    # Assertions
    await terminal.expect.to_contain("src/")

    # Screenshots
    await terminal.screenshot("debug.png")
```

## API Reference

### Ghostty Client

| Method                      | Description                   |
| --------------------------- | ----------------------------- |
| `terminals.all()`           | Get all terminals             |
| `terminals.first()`         | Get the first terminal        |
| `terminals.focused()`       | Get the focused terminal      |
| `terminals.by_title(title)` | Find by title (partial match) |
| `new_window(command?)`      | Open a new window             |
| `new_tab(command?)`         | Open a new tab                |

### Terminal

| Method                      | Description                  |
| --------------------------- | ---------------------------- |
| `send(text)`                | Send text + Enter            |
| `type(text, delay_ms?)`     | Type character by character  |
| `press(key)`                | Press a key (Enter, Ctrl+C)  |
| `screen()`                  | Get current screen content   |
| `wait_for_text(pattern)`    | Wait for text to appear      |
| `wait_for_prompt()`         | Wait for shell prompt        |
| `wait_for_idle(stable_ms?)` | Wait for screen to stabilize |
| `screenshot(path)`          | Capture as PNG               |

### Expect Assertions

| Method                 | Description              |
| ---------------------- | ------------------------ |
| `to_contain(text)`     | Assert text is present   |
| `not_to_contain(text)` | Assert text is absent    |
| `to_match(pattern)`    | Assert regex matches     |
| `to_have_title(title)` | Assert window title      |
| `prompt()`             | Assert prompt is visible |

## Installation

```bash
pip install ghostty-automator

# Requires ghostty-automator fork with IPC support
brew tap hyperb1iss/bliss
brew install ghostty-automator
```

---

**Automate your terminal workflows with confidence.**

