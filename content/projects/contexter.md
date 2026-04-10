---
emoji: '📋'
title: 'Contexter: Code Context for LLMs'
date: '2024-09-25'
description:
  'Chrome extension and CLI for quickly copying code context into LLMs. Smart
  filtering, duplicate detection, and clipboard integration.'
tags: ['Rust', 'CLI', 'Chrome Extension', 'LLM']
github: 'https://github.com/hyperb1iss/contexter'
---

## Overview

Contexter is a dual-purpose tool for gathering code context to feed into Language Models. It combines a Rust-based CLI with a Chrome extension, making it quick to collect, filter, and copy project files for LLM prompts.

## Key Features

- **Smart Directory Traversal**: Recursively walks through directories to gather
  relevant files
- **Flexible Filtering**: Include by extension, exclude by regex pattern
- **Clipboard Integration**: Copy concatenated content to your clipboard
- **Duplicate Detection**: Skips duplicate file contents based on content hashes
- **Consistent Output**: Reliable, ordered output of files
- **Dark Mode Support**: Comfortable viewing in any lighting condition
- **Secure API Key Management**: SHA-256 hashed API keys for authenticated
  access

## Technical Stack

- **Backend**: Rust
- **Frontend**: HTML, CSS, JavaScript
- **Browser Extension**: Chrome Extension API
- **API**: RESTful with JSON communication

## Use Cases

1. **Code Review Assistance**: Quickly gather context from specific parts of
   your project for LLM-powered review suggestions
2. **Documentation Generation**: Collect project structure info to help LLMs
   generate or update documentation
3. **Bug Analysis**: Provide relevant code snippets for more accurate bug
   analysis and solutions
4. **Refactoring Support**: Gather context about related files and functions to
   assist with refactoring strategies

## Getting Started

### CLI Installation

```bash
git clone https://github.com/hyperb1iss/contexter.git
cd contexter
cargo build --release
```

### Chrome Extension Installation

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` directory from the Contexter
   project

## Usage Example

### CLI

```bash
contexter /path/to/your/project rust js --exclude ".*test.*"
```

### Chrome Extension

1. Click the Contexter icon in your browser
2. Select your project from the list
3. Choose the files you want to include
4. Click "Fetch Content" or "Copy to Clipboard"

