---
emoji: '📋'
title: 'Contexter: Bring the Right Code to the Conversation'
description: 'A Rust context server, CLI, and Chrome extension for selecting project files and assembling readable source material for an AI conversation.'
date: '2024-09-25'
github: 'https://github.com/hyperb1iss/contexter'
tags: ['Rust', 'TypeScript', 'CLI', 'Chrome Extension', 'Developer Tools', 'LLM']
---

A useful question about a codebase often spans several files. Contexter gathers those files into a readable package, keeping their names and contents together so you can bring the relevant code into an AI conversation without assembling it by hand.

The project combines a Rust CLI and server with a Chrome extension. Register a local project once, browse its file tree from the extension, select the pieces you need, and copy the assembled context. The CLI provides a direct gathering workflow for shell use and scripts.

## Choose what belongs in the prompt

File discovery respects Git ignore rules and applies exclusions for common build artifacts, dependencies, and binary formats. You can narrow the selection by extension or exclusion pattern. Content hashing skips repeated file contents, and the generated text includes file metadata so a reader can tell where each section came from.

The selection remains yours. For a focused review, gather the implementation and its nearby tests. For an architecture discussion, include the relevant configuration and documentation. Contexter handles the collection and presentation of source material; you decide what the question needs.

## A browser front end for local projects

The extension gives the collection workflow a file browser with project selection and clipboard access. A local REST service supplies the project listings and requested contents, with API-key authentication for its endpoints. The same service can be used from other tools that need to retrieve project context.

The [Contexter repository](https://github.com/hyperb1iss/contexter) contains the server, extension, and setup documentation. Together they offer a direct path from a local working tree to a carefully chosen prompt.
