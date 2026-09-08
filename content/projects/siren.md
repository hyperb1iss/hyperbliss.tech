---
emoji: '🧜‍♀️'
title: 'Siren: One Frontend for Code Quality'
description: 'An in-development Rust frontend that detects project languages, selects existing quality tools, and brings their checks and fixes into one terminal workflow.'
date: '2025-03-07'
github: 'https://github.com/hyperb1iss/siren'
tags: ['Rust', 'CLI', 'Linting', 'Developer Tools', 'Automation', 'Open Source']
---

A mixed-language repository can have several perfectly good quality tools and no pleasant way to run them together. Siren brings formatting, linting, and fixing into a common command-line workflow, using project detection to decide which tools belong in the run.

Written in Rust, the frontend delegates analysis to existing tools. The project includes integrations for the Rust, Python, and HTML ecosystems, with JavaScript and TypeScript support still developing.

## Let the tools do their jobs

Siren's adapters cover tools such as Clippy, Ruff, and djlint. Each adapter connects an external tool to the common runner and result model, giving the frontend a way to coordinate checks without implementing another language analyzer.

Project detection and file collection establish what needs checking. Dedicated commands handle checking, formatting, and fixing, while configuration provides room for tool-specific options. The result is a common entry point across repositories that may use very different language tooling underneath.

## Coordination is the interesting part

The runner executes tools in parallel and gathers their results for terminal reporting. Separate modules handle detection, configuration, tool integration, and output, so support for another tool has a defined place in the system.

Color and progress indicators help distinguish what is running from what needs attention. Siren aims to reduce setup across a mixed-language repository while keeping each tool's useful configuration choices available.

The [Siren repository](https://github.com/hyperb1iss/siren) documents current support, configuration, and the remaining development work.
