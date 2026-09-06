---
category: 'agents'
emoji: '🔮'
title: 'Git-Iris: The Story Behind the Diff'
description: 'A Rust Git companion that investigates code and history to draft commits, reviews, pull requests, and release notes in a richly interactive terminal.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/git-iris'
tags: ['Rust', 'Git', 'AI', 'CLI', 'Developer Tools', 'OpenAI', 'Anthropic', 'GitHub Action']
---

A diff shows what changed. Explaining why the change matters takes another kind of work. Git-Iris brings that work into the terminal: an AI companion that can inspect a repository, follow its history, and help turn a patch into something another person can understand.

I built Git-Iris around Iris, an agent with tools for reading files, searching code, and examining Git history. She can move from a broad summary to an individual change as the question demands. The same foundation supports commit messages, code reviews, and pull request descriptions, with changelog and release-note workflows for the larger picture.

## A conversation beside the code

Iris Studio gives those workflows a shared home. The terminal interface uses SilkCircuit's electric palette and lets you talk through a change while refining the document it produces. Ask for a clearer explanation, examine the relevant code, or adjust the emphasis before committing to the result.

The interaction matters as much as the generation. A useful first draft becomes more useful when the evidence and the editing conversation stay close together. Dedicated CLI commands also make the individual workflows available to scripts and CI.

## History with receipts

Semantic blame follows a selected piece of code back through its introducing patches and surrounding history. The workflow asks Iris to distinguish documented intent from a plausible explanation and cite the evidence behind her answer. Some history leaves questions open; the output should make those gaps visible.

Git-Iris is written in Rust and supports OpenAI, Anthropic, and Google providers. A GitHub Action brings release documentation into automation. The [Git-Iris documentation](https://hyperb1iss.github.io/git-iris/) covers Studio, provider configuration, and the individual Git workflows.
