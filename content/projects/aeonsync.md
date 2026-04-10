---
emoji: '🌀'
title: 'AeonSync: Simple but Powerful Backup Manager'
date: '2024-09-25'
tags: ['Python', 'rsync', 'Backup', 'CLI', 'DevOps']
description: 'Incremental remote backups powered by rsync with retention policies,
  interactive restore, and a clean CLI built on Typer.'
github: 'https://github.com/hyperb1iss/aeonsync'
---

AeonSync combines the efficiency of rsync with a clean command-line interface for managing backups across systems. Incremental snapshots, customizable retention, and interactive file restoration in one tool.

## Key Features

- **Incremental Backups**: Uses rsync's `--link-dest` for efficient storage
- **Secure Remote Syncing**: SSH-based data transfer
- **Retention Policies**: Automatic cleanup based on user-defined rules
- **Dry-run Mode**: Test backups without making changes
- **Metadata Tracking**: Maintains detailed metadata for each backup
- **Rich CLI**: Powered by Typer with colorized output
- **Multiple Source Support**: Backup multiple directories in a single operation
- **Latest Backup Symlink**: Automatically links to the most recent backup
- **Interactive Restore**: Guided process with version selection, file preview,
  and diff display

## Getting Started

### Installation

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

## Open Source

AeonSync is open-source software, licensed under the GNU General Public License v3.0. Contributions from the community are welcome! Check out the [GitHub repository](https://github.com/hyperb1iss/aeonsync) to get involved or report issues.
