---
category: 'agents'
emoji: '⚡'
title: 'q: Claude Within Reach'
description: 'A compact Claude CLI for quick questions, shell pipelines, persistent conversations, and tool-assisted tasks, built with TypeScript, Bun, and Ink.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/q'
tags: ['TypeScript', 'Bun', 'Ink', 'Claude', 'CLI', 'AI', 'Developer Tools']
---

Sometimes the next step is a question: explain this error, summarize this diff, or turn this text into another format. My command-line tool, q, puts Claude a single command away and keeps the answer in the terminal where the work is happening.

A quick query streams an answer. Pipe mode accepts input from another command and writes the response to standard output. Interactive mode opens a terminal conversation, while agent mode can use tools to work with local files and run commands.

## Fit the shape of the work

The pipe workflow is especially useful for small transformations. Pass in a configuration file or a patch, describe the output you need, and send the result onward to another command or a file. Diagnostic messages use standard error, keeping them separate from the response. Pipeline mode allows read-only tools and denies write operations that would require an interactive decision.

For a task that needs editing or command execution, agent mode presents tool approval prompts. The interactive interface, built with Ink, supports the longer conversation around that work. Local SQLite storage keeps sessions and usage information available for later review or continuation.

## Stay close to the shell

Optional shell integration adds shortcuts for asking about the previous command or error and resuming a conversation. Color controls include support for plain output and the NO_COLOR convention, so the interface can fit the terminal around it.

The implementation uses TypeScript, Bun, and the Claude Agent SDK. The [q repository](https://github.com/hyperb1iss/q) covers configuration, shell integration, and the distinctions between its query, pipeline, interactive, and execution modes.
