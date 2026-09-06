---
category: 'terminal'
emoji: '🎭'
title: 'Ghostty Automator: A Testable Terminal'
description: 'Python automation for Ghostty with screen inspection, keyboard and mouse input, assertions, and screenshots for terminal applications.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/ghostty-automator-python'
tags: ['Python', 'Ghostty', 'Terminal', 'Automation', 'Testing', 'MCP']
---

A terminal application has a visible interface: focus moves, panels resize, menus open, and text arrives over time. Ghostty Automator makes that interface available to Python, so a script can interact with a running terminal and inspect the result.

The API borrows the familiar shape of browser automation. Connect to Ghostty, find a terminal by its title or working directory, send input, and wait for the expected text. Assertions and PNG screenshots give a test both a programmatic check and a visual record of what appeared.

## Work with the screen

The library supports keyboard input and mouse interactions, including scrolling and dragging. Scripts can open tabs or windows, resize a terminal, and read its screen contents. Cell-level inspection exposes more detail when plain text cannot describe the interface sufficiently.

Waiting helpers look for text, match a shell prompt, or observe a period of stable screen content. Those are useful conditions to put directly in a test: open a menu, wait for its label, move the selection, then capture the result. The terminal remains the actual surface under inspection.

## Python scripts and agent tools

The primary API is asynchronous, with a synchronous wrapper for straightforward scripts. An accompanying MCP server exposes terminal operations to compatible assistants, making the same environment available for interactive agent workflows.

Ghostty Automator requires [my Ghostty fork with IPC support](https://github.com/hyperb1iss/ghostty-automator). Standard Ghostty does not provide this automation protocol. The [Python library repository](https://github.com/hyperb1iss/ghostty-automator-python) documents that setup and includes examples for exercising terminal applications.
