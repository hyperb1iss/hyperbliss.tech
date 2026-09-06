---
category: 'terminal'
emoji: '🖨️'
title: 'SilkPrint: Markdown Worth Reading'
description: 'A themed Markdown reader and PDF renderer written in Rust, with terminal navigation, inline images and diagrams, and Typst-powered document output.'
date: '2025-10-01'
github: 'https://github.com/hyperb1iss/silkprint'
tags: ['Rust', 'CLI', 'TUI', 'Typst', 'PDF', 'Markdown', 'Typography']
---

Markdown travels well. Reading it should feel just as good, whether you are opening a README in the terminal or sending someone a finished document. SilkPrint brings both experiences into one Rust tool, with a shared theme system for its terminal reader and Typst-powered PDF output.

The visual range is broad: quiet manuscript styles, familiar developer palettes, and the electric colors of SilkCircuit. Typography, syntax highlighting, tables, and callouts give each document a readable hierarchy while leaving room for personality.

## Stay with the document

The terminal reader opens a Markdown file as a scrollable document with an outline, search, and a live theme picker. Relative Markdown links open inside the reader, with back and forward history for moving through a collection of files. Changes on disk trigger a reload, so the reader can sit beside an editor while you write.

Images use the terminal's available graphics protocol, with a character-based fallback. Mermaid diagrams render inline, and code blocks use the theme's syntax colors. When output is piped, SilkPrint produces styled ANSI text that can continue through a shell workflow.

## Give the page its own care

The PDF path uses Typst for typesetting. YAML front matter supplies document details, including title and author, while rendering options control paper size, title pages, and a table of contents. Math, footnotes, and GitHub-style alerts support technical material beyond plain paragraphs.

Custom TOML themes expose the document's design choices, and the built-in collection includes light, dark, and print-oriented options. The shared palette keeps the two reading experiences related while each renderer handles its own medium.

See the reader, sample documents, and theme gallery in the [SilkPrint repository](https://github.com/hyperb1iss/silkprint).
