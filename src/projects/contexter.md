---
title: "🚀 Contexter: Streamlined Context Gathering for LLMs"
date: 2024-09-25
description: "A powerful command-line and browser extension tool for gathering context from files, perfect for feeding into Language Models (LLMs)."
tags: ["Rust", "CLI", "Browser Extension", "LLM", "Context Gathering"]
categories: ["Projects", "Developer Tools"]
image: "/images/contexter-banner.jpg"
github: "https://github.com/hyperb1iss/contexter"
---

## 🚀 Overview

Contexter is a robust, dual-purpose tool designed to ease the way developers interact with Language Models (LLMs). It combines a powerful Rust-based CLI application with a sleek Chrome extension, offering a seamless experience for gathering and managing context from your projects.

## ✨ Key Features

- 🗂️ **Smart Directory Traversal**: Recursively walks through directories to gather relevant files.
- 🔍 **Flexible Filtering**: Includes files based on specified extensions and excludes patterns using regex.
- 📋 **Clipboard Integration**: Easily copy concatenated content to your clipboard.
- 🔄 **Duplicate Detection**: Skips duplicate file contents based on content hashes for efficiency.
- 📑 **Consistent Output**: Ensures a reliable, ordered output of files.
- 🌓 **Dark Mode Support**: Comfortable viewing in any lighting condition.
- 🔐 **Secure API Key Management**: Keeps your interaction with the server safe and authenticated.

## 🛠️ Technical Stack

- **Backend**: Rust
- **Frontend**: HTML, CSS, JavaScript
- **Browser Extension**: Chrome Extension API
- **API**: RESTful API with JSON communication
- **Security**: SHA-256 hashing for API keys

## 💡 Use Cases

1. **Code Review Assistance**: Quickly gather context from specific parts of your project to ask an LLM for code review suggestions.
2. **Documentation Generation**: Collect information about your project structure to help LLMs generate or update documentation.
3. **Bug Analysis**: Provide relevant code snippets and file structures to LLMs for more accurate bug analysis and potential solutions.
4. **Refactoring Support**: Gather context about related files and functions to assist LLMs in suggesting refactoring strategies.

## 🚀 Getting Started

### CLI Installation

```bash
git clone https://github.com/hyperb1iss/contexter.git
cd contexter
cargo build --release
```

### Chrome Extension Installation

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` directory from the Contexter project

## 📖 Usage Example

### CLI

```bash
contexter /path/to/your/project rust js --exclude ".*test.*"
```

### Chrome Extension

1. Click the Contexter icon in your browser
2. Select your project from the list
3. Choose the files you want to include
4. Click "Fetch Content" or "Copy to Clipboard"

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](https://github.com/hyperb1iss/contexter/blob/main/CONTRIBUTING.md) for details on how to get started.

## 📄 License

Contexter is open-source software licensed under the Apache 2.0 License.
