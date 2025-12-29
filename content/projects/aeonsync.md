---
emoji: '🌀'
title: 'AeonSync: Powerful Remote Backup Tool'
date: '2024-09-25'
tags: ['Python', 'Backup', 'CLI', 'DevOps', 'Open Source']
description:
  'AeonSync is a flexible and powerful remote backup tool for developers and
  system administrators, offering incremental backups, secure syncing, and an
  intuitive CLI.'
github: 'https://github.com/hyperb1iss/aeonsync'
---

AeonSync is a powerful and flexible remote backup tool designed for developers
and system administrators. It combines the efficiency of rsync with a
user-friendly command-line interface, providing a robust solution for managing
backups across systems.

## Key Features

- 🔄 **Incremental Backups**: Utilizes rsync's `--link-dest` for efficient
  storage management
- 🔐 **Secure Remote Syncing**: Implements SSH for secure data transfer
- ⏱️ **Customizable Retention Policies**: Automatically cleans up old backups
  based on user-defined rules
- 🧪 **Dry-run Mode**: Test backups without making changes to ensure
  configuration accuracy
- 📊 **Detailed Metadata Tracking**: Maintains comprehensive metadata for each
  backup operation
- 🖥️ **User-friendly CLI**: Powered by Typer for an intuitive command-line
  interface
- 🎨 **Rich Console Output**: Enhances readability with colorized and formatted
  output
- 🔍 **Verbose Mode**: Provides detailed transfer logs for in-depth analysis
- 🗂️ **Multiple Source Support**: Backup multiple directories in a single
  operation
- 🔁 **Latest Backup Symlink**: Automatically creates a symlink to the most
  recent backup
- 🕰️ **Version Selection**: Choose specific versions of files for restoration
- 👀 **File Preview**: View file contents before restoration
- 📊 **Diff Display**: Compare different versions of files
- 🔄 **Interactive Restore**: User-friendly guided process for file recovery
- 📜 **Comprehensive Backup Listing**: Detailed information about all available
  backups
- ⚙️ **Flexible Configuration**: Easily customizable through command-line
  options or configuration file

## Getting Started

### Installation

AeonSync can be easily installed using pip:

```bash
pip install aeonsync
```

### Basic Usage

To create a backup:

```bash
aeon sync --remote user@host:/path/to/backups
```

To restore a file:

```bash
aeon restore [OPTIONS] FILE [DATE]
```

To list available backups:

```bash
aeon list-backups
```

## Why AeonSync?

AeonSync stands out from other backup solutions due to its combination of
powerful features and ease of use. It's designed to be flexible enough for
complex backup scenarios while remaining approachable for users who prefer a
straightforward command-line tool.

Whether you're a developer backing up project files, a system administrator
managing server backups, or an individual protecting personal data, AeonSync
provides the tools you need to ensure your data is safely and efficiently backed
up.

## Open Source

AeonSync is open-source software, licensed under the GNU General Public License
v3.0. Contributions from the community are welcome! Check out the
[GitHub repository](https://github.com/hyperb1iss/aeonsync) to get involved or
report issues.

## Future Development

The AeonSync project is actively maintained and developed. Future plans include:

- GUI interface for those who prefer graphical tools
- Integration with cloud storage providers for off-site backups
- Enhanced reporting and analytics features
- Support for backup encryption

Stay tuned for updates and new features!
