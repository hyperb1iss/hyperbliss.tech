---
title: "🔮 Git-Iris: AI-Powered Git Workflow Assistant"
description: "A comprehensive AI-powered Git workflow assistant that enhances your development process from start to finish."
github: "https://github.com/hyperb1iss/git-iris"
tags: ["rust", "git", "ai", "cli", "developer-tools", "automation", "openai", "anthropic"]
---

Git-Iris is a comprehensive AI-powered Git workflow assistant that enhances your development process from start to finish. By leveraging advanced AI models, Git-Iris boosts your productivity and improves the quality of your project documentation.

## Features

- 🤖 **Intelligent Commit Messages**: Generate context-aware, meaningful commit messages
- 📜 **Dynamic Changelog Generation**: Create structured, detailed changelogs between any two Git references
- 📋 **Comprehensive Release Notes**: Automatically generate release notes with summaries and key changes
- 🔄 **Multi-Provider AI Support**: Leverage OpenAI GPT-4o, Anthropic Claude, or Ollama for AI capabilities
- 🎨 **Gitmoji Integration**: Add expressive emojis to your commits, changelogs, and release notes
- 🖥️ **Interactive CLI**: Refine AI-generated content through an intuitive command-line interface
- 🔧 **Customizable Workflows**: Tailor AI behavior with custom instructions and presets
- 📚 **Flexible Instruction Presets**: Quickly switch between different documentation styles
- 🧠 **Smart Context Extraction**: Analyze repository changes for more accurate AI-generated content
- 📊 **Intelligent Code Analysis**: Provide context-aware suggestions based on your codebase

## Installation

You can install Git-Iris using Cargo:

```bash
cargo install git-iris
```

## Quick Start

1. Configure Git-Iris:

```bash
git-iris config --provider openai --api-key YOUR_API_KEY
```

2. Generate a commit message:

```bash
git-iris gen
```

3. Generate a changelog:

```bash
git-iris changelog --from v1.0.0 --to v1.1.0
```

4. Generate release notes:

```bash
git-iris release-notes --from v1.0.0 --to v1.1.0
```

## Documentation

For more detailed information on using Git-Iris, please refer to our [documentation](https://github.com/hyperb1iss/git-iris/wiki).


