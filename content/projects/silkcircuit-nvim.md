---
category: 'web'
title: 'SilkCircuit: Electric Color, Everywhere You Work'
description: 'A shared color system for editors, terminals, browsers, and command-line tools, with five variants and generated themes drawn from one palette.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/silkcircuit'
tags: ['Design System', 'Neovim', 'Lua', 'Colorscheme', 'Developer Tools', 'Theming']
---

SilkCircuit gives a development environment a recognizable visual identity: electric purple, clear cyan, and bright pink against deep backgrounds, with a light variant for a different kind of day. The colors carry through the editor, terminal, and tools around them, making a workspace feel considered down to its smallest details.

Neovim is a central part of the project, with syntax and plugin integrations, but the color system reaches well beyond one editor. Matching themes cover VS Code, Helix, terminal emulators, multiplexers, browsers, and command-line tools.

## Five ways to set the mood

Neon is the signature saturated palette. Vibrant and Soft ease the intensity, Glow puts bright colors against a darker background, and Dawn brings the system into a light theme. The variants share a visual vocabulary while making different choices about background and emphasis.

Semantic color mappings give the palette a job. Syntax, diagnostics, selections, and interface borders need different levels of attention. SilkCircuit carries those decisions into integrations for tools with very different layouts, from a Neovim sidebar to a terminal prompt or a Git diff.

## One source for the details

The theme generator produces application-specific files from shared variant definitions. That connection matters: a palette change can propagate through the supported exports without manually repainting dozens of unrelated configurations. Each target translates the colors into the format its application understands.

Installers help place themes in the right locations, with dry-run support and backups for replaced files. Individual exports remain available for people who want to theme only a few tools or manage configuration themselves.

Browse the variants and application guides in the [SilkCircuit documentation](https://hyperb1iss.github.io/silkcircuit/). The [repository](https://github.com/hyperb1iss/silkcircuit) includes the palettes, generators, and integrations.
