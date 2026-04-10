---
emoji: '🪐'
title: 'Cosmosys: Stellar Release Management'
date: '2024-09-25'
description: 'Customizable release management tool for automating version bumps,
  changelogs, tagging, and CI/CD integration across languages.'
github: 'https://github.com/hyperb1iss/cosmosys'
tags: ['Python', 'DevOps', 'CLI', 'Release Management', 'Automation', 'Git', 'CI/CD']
---

## Key Features

- **Multiple Color Schemes**: Customize your CLI with built-in and custom color
  themes
- **ASCII Art Logo**: Add personality to your release process with customizable
  ASCII art
- **Modular Release Flow**: Configure release steps to match your project
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Version Management**: Automatic version bumping and tagging
- **Git Integration**: Commit changes, create tags, and push to remote repos
- **Pre-Release Checks**: Configurable checks to ensure release readiness
- **Release Notes Generation**: Automatic release notes and changelog management
- **CI/CD Integration**: Hooks into popular CI/CD platforms
- **Plugin System**: Extend functionality with custom plugins
- **Dry-Run Mode**: Test your release process without making changes
- **Rollback**: Safely undo changes if something goes wrong
- **Multi-Language**: Manage releases for projects in different languages

## Getting Started

### Installation

```bash
# Using pip
pip install cosmosys

# Using Poetry
poetry add cosmosys
```

### Quick Start

1. Initialize a new Cosmosys configuration:

   ```bash
   cosmosys config --init
   ```

2. Customize your `cosmosys.toml` file to fit your project's needs.

3. Run your first release:

   ```bash
   cosmosys release
   ```

## Customization

Cosmosys is highly customizable:

- **Themes**: Choose from built-in themes or create your own to match your
  project's branding
- **Plugins**: Extend functionality with custom plugins to integrate with your
  tools and workflows
- **Release Steps**: Define and order your release steps to create the perfect
  release process for your project
