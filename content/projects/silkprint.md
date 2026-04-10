---
emoji: '🖨️'
title: 'SilkPrint: Markdown to PDF, Made Beautiful'
description: 'Transform Markdown into beautiful PDFs with 40 built-in themes, syntax
  highlighting, math support, and the SilkCircuit design language. Rust + Typst.'
date: '2025-10-01'
github: 'https://github.com/hyperb1iss/silkprint'
tags: ['Rust', 'CLI', 'Typst', 'PDF', 'Markdown', 'Typography']
---

SilkPrint transforms Markdown into beautiful PDFs with electric elegance. Powered by Typst for typesetting and built in Rust for speed, it ships 40 themes across 8 aesthetic families, from academic papers to cyberpunk manifestos.

## Features

| Capability              | What You Get                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| **40 Built-in Themes**  | 8 families: Signature, SilkCircuit, Developer, Classic, Nature... |
| **Syntax Highlighting** | 20+ languages via TextMate grammars                               |
| **Typst Math**          | Native LaTeX-style math rendering                                 |
| **Auto Title Pages**    | Generated from YAML front matter                                  |
| **Table of Contents**   | Configurable, auto-generated                                      |
| **GitHub Alerts**       | Note, tip, important, warning, caution blocks                     |
| **Custom Themes**       | Full TOML theme format with 24 configurable sections              |
| **Color Emoji**         | Bundled Noto Color Emoji for universal rendering                  |
| **Accessible**          | Print-safe themes with WCAG contrast validation                   |

## Theme Families

- **SilkCircuit**: Dawn, Neon, Vibrant, Soft, Glow
- **Developer**: Nord, Dracula, Solarized, Catppuccin, Gruvbox, Tokyo Night,
  Rose Pine
- **Classic**: Academic, Typewriter, Newspaper, Parchment
- **Nature**: Forest, Ocean, Sunset, Arctic, Sakura
- **Futuristic**: Cyberpunk, Terminal, Hologram, Synthwave, Matrix
- **Artistic**: Noir, Candy, Blueprint, Witch

## Usage

```bash
# Basic conversion
silkprint README.md -o output.pdf

# Pick a theme
silkprint notes.md -t cyberpunk -o notes.pdf

# SilkCircuit neon with auto-open
silkprint doc.md -t silkcircuit-neon --open

# List all themes
silkprint --list-themes

# Custom paper size, no title page
silkprint report.md -p letter --no-title-page -o report.pdf
```

## Installation

```bash
# Homebrew
brew tap hyperb1iss/tap && brew install silkprint

# Cargo
cargo install silkprint
```

---

**Beautiful documents, straight from the terminal.**
