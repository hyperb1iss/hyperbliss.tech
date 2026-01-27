---
emoji: '💜'
title: 'SilkCircuit: Electric Dreams for Neovim'
description:
  'A cyberpunk Neovim colorscheme with vibrant purples, blazing pinks, and neon
  accents. WCAG AA compliant with <5ms load time.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/silkcircuit-nvim'
tags: ['Neovim', 'Lua', 'Colorscheme', 'Theme', 'Developer Tools']
---

## 🎭 Overview

**SilkCircuit** pumps maximum visual voltage through your Neovim. Electric
purples, blazing pinks, and neon cyans create a coding environment that's both
striking and readable.

## 🦄 Features

- 🎪 **Electric Color System** — Vibrant palette with semantic color mappings
- 🏎️ **<5ms Load Time** — Bytecode compilation with intelligent caching
- 👁️ **WCAG AA Compliant** — Validated contrast ratios for extended sessions
- 🎛️ **5 Theme Variants** — Neon, Vibrant, Soft, Glow, and Dawn modes
- 🔮 **40+ Plugin Integrations** — Auto-detected support for your entire
  toolchain
- 💾 **Persistent Preferences** — Settings survive across sessions

## 💫 Installation

```lua
-- lazy.nvim
{
  "hyperb1iss/silkcircuit-nvim",
  lazy = false,
  priority = 1000,
  config = function()
    vim.cmd.colorscheme("silkcircuit")
  end,
}
```

## 🌈 Theme Variants

```vim
:SilkCircuit neon     " 100% intensity, dark theme
:SilkCircuit vibrant  " 85% intensity, dark theme
:SilkCircuit soft     " 70% intensity, dark theme
:SilkCircuit glow     " Ultra-dark with pure neon colors
:SilkCircuit dawn     " Light theme for daytime
```

## 💜 Color Palette

| Color  | Hex       | Usage                   |
| ------ | --------- | ----------------------- |
| Purple | `#e135ff` | Keywords, importance    |
| Pink   | `#ff79c6` | Strings, accents        |
| Cyan   | `#80ffea` | Functions, interactions |
| Green  | `#50fa7b` | Success, additions      |
| Yellow | `#f1fa8c` | Warnings, attention     |
| Orange | `#ffb86c` | Constants, numbers      |

## 🌃 Complete Environment

SilkCircuit extends beyond Neovim with matching themes for:

- **VSCode/Cursor** — All 5 variants included
- **Terminal Emulators** — Alacritty, Kitty, Warp, Windows Terminal, iTerm2
- **Git** — Custom log formatting with conventional commit highlighting
- **AstroNvim** — Complete integration with enhanced components

---

**Pure electric energy for your editor.**
