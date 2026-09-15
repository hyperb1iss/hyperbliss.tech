---
category: 'web'
title: "Stefanie's Dotfiles: A Workspace That Travels"
description: 'My development environment across macOS, Linux, Windows, and WSL2: modular shells, Neovim, terminal tooling, and SilkCircuit color throughout.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/dotfiles'
tags: ['Shell', 'Zsh', 'Neovim', 'Tmux', 'macOS', 'Linux', 'PowerShell', 'Developer Tools']
---

My dotfiles are the working environment around the code: the prompt that tells me where I am, the history that remembers a command, the editor that knows the project, and the colors that make the whole space feel familiar. The repository brings that environment to macOS, Linux, Windows, and WSL2.

The Unix setup centers on a modular Zsh configuration with a Bash fallback. Windows gets HyperShell, a PowerShell module with Linux-shaped commands and its own platform integration. Shared habits carry across machines while each operating system keeps the tools it needs.

## Familiar tools, carefully connected

Ghostty, tmux, and AstroNvim form the main workspace. Starship puts repository context in the prompt; Atuin handles searchable shell history; fuzzy finding makes files and commands easier to reach. Git diff styling, directory navigation, and language tooling fill in the everyday movements between editing and running code.

SilkCircuit ties the visual details together across the editor, terminal, and command-line tools. A diff, a fuzzy finder, and a status bar each have different jobs, but their colors can still feel like parts of the same environment. The repository also includes in-editor and terminal AI tooling alongside the conventional development setup.

## Configuration that knows its machine

The installation model composes a base layer with operating-system and machine-role configuration. A desktop gets its graphical tools; a headless server can take a smaller shell-focused setup. Machine-specific layers provide a place for the exceptions without turning the shared configuration into a pile of competing copies.

The [dotfiles field manual](https://hyperb1iss.github.io/dotfiles/) explains the setup and everyday commands. The [public repository](https://github.com/hyperb1iss/dotfiles) contains the configuration, installers, and checks for adapting the pieces to your own workspace.
