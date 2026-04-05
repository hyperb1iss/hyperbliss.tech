---
emoji: '✦'
title: 'Opaline: A Token-Based Theme Engine for Rust'
description:
  'Semantic color tokens, 39 builtin themes, multi-stop gradients, and deep
  integrations with Ratatui, egui, crossterm, and more.'
date: '2026-01-15'
github: 'https://github.com/hyperb1iss/opaline'
tags: ['Rust', 'TUI', 'Ratatui', 'Theming', 'Design System', 'Open Source']
---

Opaline is a token-based theme engine that gives Rust applications beautiful,
consistent color systems. Define themes once with 26 semantic tokens, then
render them anywhere: Ratatui TUIs, egui GUIs, crossterm, web via CSS, or syntax
highlighting via syntect.

## Core Concepts

| Concept                  | What It Does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| **Semantic Tokens**      | 26 tokens across `text.*`, `bg.*`, `accent.*`, `border.*`, `code.*` |
| **39 Builtin Themes**    | SilkCircuit, Catppuccin, Dracula, Nord, Tokyo Night, Rose Pine...   |
| **Multi-Stop Gradients** | Smooth color interpolation with `gradient_bar()` and friends        |
| **Deep Integrations**    | Ratatui, egui, crossterm, owo-colors, syntect, colored, CSS         |
| **ThemeBuilder**         | Programmatic theme construction with cycle detection                |
| **Theme Discovery**      | Scan `~/.config/` for user-defined themes                           |
| **ThemeSelector**        | Built-in picker widget with live preview and search                 |

## Integrations

```rust
use opaline::Theme;

// Ratatui — direct conversion to Style/Color
let style = theme.accent_primary().style();
let span = theme.text_primary().span("hello");

// Gradients across widgets
let bar = theme.gradient_bar(area, &[
    theme.accent_primary(),
    theme.accent_secondary(),
]);

// egui — full Visuals generation
let visuals = theme.to_egui_visuals();

// CSS — generate custom properties
let css = theme.to_css();

// syntect — syntax highlighting themes
let syntect_theme = theme.to_syntect_theme();
```

## Theme Gallery

- **SilkCircuit**: Neon, Vibrant, Soft, Glow, Dawn
- **Catppuccin**: Latte, Frappe, Macchiato, Mocha
- **Tokyo Night**: Night, Storm, Day
- **Rose Pine**: Base, Moon, Dawn
- **Kanagawa**: Wave, Dragon, Lotus
- Plus: Dracula, Nord, Gruvbox, Solarized, Monokai Pro, Ayu, Everforest,
  Flexoki, Palenight, Night Owl, GitHub, One Dark/Light

## Installation

```toml
[dependencies]
opaline = "0.4"

# Feature flags
opaline = { version = "0.4", features = ["ratatui", "gradients", "egui", "css"] }
```

## Used By

- **git-iris**: AI-powered Git workflow assistant
- **unifly**: UniFi network management CLI & TUI

---

**One theme engine, every rendering target.**
