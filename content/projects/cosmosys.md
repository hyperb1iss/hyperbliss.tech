---
category: 'terminal'
title: 'Cosmosys: Releases with a Clear Sequence'
date: '2024-09-25'
description: 'A Python release automation tool that describes version updates, changelogs, builds, and publishing as configurable steps for Python, Rust, and Node.js projects.'
github: 'https://github.com/hyperb1iss/cosmosys'
tags: ['Python', 'DevOps', 'CLI', 'Release Management', 'Automation', 'Git']
---

A release crosses several boundaries before anyone can install it. The version changes in one file, the changelog records what changed, Git captures the milestone, and a package registry receives the build. Cosmosys brings those operations into a configurable sequence for Python, Rust, and Node.js projects.

The project puts the release procedure in a TOML file. Named steps describe the work and its order, giving maintainers a place to inspect the process alongside the code it ships. A dry run lists the steps that would execute before a real release begins.

## A workflow built from steps

Cosmosys includes steps for version updates, changelog changes, Git commits and tags, language-specific builds, and package publishing. Semantic version selection supports the familiar major, minor, and patch increments as well as explicit version choices.

The Python implementation gives each step a shared context for configuration and console output. Steps register by name, and the release manager resolves those names when it runs the configured sequence. Custom steps can use the same interface, keeping project-specific work inside the release flow.

## Making the process visible

The command-line interface reports progress and failures, with selectable color themes and optional branding. Those details matter most during an operation where the reader needs to know what happened and where execution stopped.

The step interface also includes rollback hooks. They provide a way for individual steps to implement cleanup, although recovery depends on the operation involved. A local file update and a published package have very different consequences.

The [Cosmosys source and configuration examples](https://github.com/hyperb1iss/cosmosys) show the release model and the available extension points.
