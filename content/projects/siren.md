---
emoji: '🧜‍♀️'
title: 'Siren: Multi-Language Linting Frontend'
description:
  'A multi-language linting frontend with smart detection, auto-fixing, and
  colorful terminal output. Supports Rust, Python, JS/TS, and HTML.'
date: '2025-03-07'
github: 'https://github.com/hyperb1iss/siren'
tags:
  ['Python', 'Rust', 'Linting', 'ESLint', 'Prettier', 'Ruff', 'Mypy', 'Clippy']
---

## Overview

Siren is a multi-language linting frontend that automatically detects your
project's languages and runs the right linters, formatters, and type checkers.
Smart defaults, colorful terminal output, and auto-fixing across Rust, Python,
JavaScript, TypeScript, and HTML.

## Key Features

- **Multi-language**: Supports Rust, Python, JavaScript, TypeScript, and
  HTML/Templates
- **Smart Detection**: Automatically identifies project languages and frameworks
- **Intelligent Tooling**: Picks the right linters and formatters for your
  project
- **Colorful Output**: Vibrant terminal experience that makes linting less
  painful
- **Fast**: Built with Rust for quick execution
- **Auto-fixing**: Automatically resolves common issues
- **Git Integration**: Focus on recently modified files for efficient workflows
- **Interactive Progress**: Live-updating spinners and progress indicators

## Tool Matrix

| Language       | Formatting             | Linting                | Type Checking | Fixing              |
| -------------- | ---------------------- | ---------------------- | ------------- | ------------------- |
| Rust           | `rustfmt`              | `clippy`               | -             | `clippy --fix`      |
| Python         | `black`, `ruff format` | `pylint`, `ruff check` | `mypy`        | `ruff --fix`        |
| JavaScript     | `prettier`             | `eslint`               | -             | `eslint --fix`      |
| TypeScript     | `prettier`             | `eslint`               | -             | `eslint --fix`      |
| HTML/Templates | `djlint`               | `djlint`               | -             | `djlint --reformat` |
