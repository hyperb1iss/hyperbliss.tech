---
category: 'terminal'
emoji: '✦'
title: 'Opaline: A Shared Language for Color'
description: 'A Rust theme engine that resolves palettes into semantic tokens, styles, and gradients for terminal interfaces, desktop apps, and CSS.'
date: '2026-01-15'
github: 'https://github.com/hyperb1iss/opaline'
tags: ['Rust', 'TUI', 'Ratatui', 'Theming', 'Design System', 'Open Source']
---

Color becomes difficult to maintain when every widget carries its own idea of purple, every warning chooses a different yellow, and a light theme means revisiting the entire interface. Opaline gives Rust applications a shared language for those decisions.

A theme starts with a palette and assigns colors to semantic roles: primary text, a muted border, an accent, or a code token. Styles and gradients build on those roles. Application code can ask for the meaning it needs while the theme decides how that meaning looks.

## From a palette to an interface

Opaline resolves TOML theme definitions through a palette, token, style, and gradient pipeline. A programmatic builder supports themes created in code, and the resolver detects reference cycles and unresolved tokens. Application-specific defaults can extend the common vocabulary while leaving room for user overrides.

The built-in collection includes SilkCircuit alongside families such as Catppuccin, Nord, and Rose Pine. A shared contract checks that those themes provide the expected core tokens, styles, and gradients. The collection gives applications a starting point and gives users a choice of familiar visual environments.

## Carrying the same decisions across renderers

Adapters translate themes into Ratatui styles, egui visuals, iced palettes, terminal colors, syntax-highlighting themes, and CSS. Feature flags let an application select the integrations it uses.

The practical details extend to choosing a theme: discovery can find user-defined files, and a Ratatui selector provides search, live preview, and cancel-and-restore behavior. Gradients can run through text and widgets using the same resolved colors as the rest of the interface.

Explore the theme model in the [Opaline documentation](https://hyperb1iss.github.io/opaline/) or inspect the adapters in the [source repository](https://github.com/hyperb1iss/opaline).
