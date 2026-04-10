---
emoji: '🌠'
title: "Stefanie's Dotfiles"
description: 'A cross-platform development environment with SilkCircuit theming, AI-powered
  editing, and unified shell config for Linux, macOS, WSL2, and Windows.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/dotfiles'
tags: ['Shell', 'Zsh', 'Bash', 'Neovim', 'Tmux', 'WSL2', 'macOS', 'PowerShell', 'Android']
---

## Overview

Welcome to my dotfiles: a cross-platform development environment that transforms your terminal into an elegant workspace. Unified config for Linux, macOS, WSL2, and Windows, with the SilkCircuit theme tying it all together.

## Core Features

| Feature                 | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| **Shell Environment**   | Unified Bash & Zsh with modern CLI tools               |
| **Android Development** | Complete AOSP build environment with smart device mgmt |
| **Terminal Setup**      | Custom Tmux, Starship prompt, fuzzy finding            |
| **WSL2 Integration**    | Windows/Linux operation with path conversion           |
| **SilkCircuit Theme**   | Consistent cyberpunk styling across all tools          |
| **AI Integration**      | AstroNvim + Avante.nvim with Claude Sonnet 4           |

## Tool Suite

### Core Development

| Tool          | Description          | Highlights                             |
| ------------- | -------------------- | -------------------------------------- |
| **Starship**  | Cross-shell prompt   | SilkCircuit theme, Git integration     |
| **AstroNvim** | Neovim configuration | IDE features, Avante.nvim AI assistant |
| **Tmux**      | Terminal multiplexer | Custom keybindings, session management |

### Modern CLI Tools

| Tool        | Description   | Features                          |
| ----------- | ------------- | --------------------------------- |
| **FZF**     | Fuzzy finder  | File search, history, completion  |
| **LSD**     | Modern ls     | Icons, SilkCircuit colors, tree   |
| **Bat**     | Enhanced cat  | Syntax highlighting, line numbers |
| **Ripgrep** | Fast searcher | Code search, regex, ignore rules  |

## SilkCircuit Theme

A cyberpunk-inspired color scheme with neon accents applied across:

- **Neovim**: Full theme with 30+ plugin support
- **Git**: Custom log formatting with `silkcircuit` pretty format
- **Starship**: Gradient effects and contextual styling
- **LSDeluxe**: File type colors matching the theme
- **Tmux**: Status bar with purple and pink accents
- **Delta**: Git diff viewer with themed colors

## Installation

```bash
# Linux/WSL2
git clone https://github.com/hyperb1iss/dotfiles.git ~/dev/dotfiles
cd ~/dev/dotfiles && make

# macOS
bash -c "$(curl -fsSL https://raw.githubusercontent.com/hyperb1iss/dotfiles/main/install_macos.sh)"

# Windows PowerShell (as admin)
git clone https://github.com/hyperb1iss/dotfiles.git $env:USERPROFILE\dev\dotfiles
cd $env:USERPROFILE\dev\dotfiles && .\install.bat
```

## HyperShell (PowerShell)

A Linux-like experience for Windows with:

- Modular architecture with 13 specialized modules
- Linux command aliases using GNU tools
- Kubernetes support with kubectl aliases and k9s
- Zoxide for smart directory navigation
- SilkCircuit branding throughout

---

**Beauty meets function. Cross-platform done right.**
