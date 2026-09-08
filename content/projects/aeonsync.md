---
emoji: '🌀'
title: 'AeonSync: Readable Backup History'
date: '2024-09-25'
tags: ['Python', 'rsync', 'Backup', 'CLI', 'DevOps']
description: 'A Python backup tool built around rsync and SSH, with dated incremental snapshots, retention settings, and file-version previews.'
github: 'https://github.com/hyperb1iss/aeonsync'
---

A backup should leave you with a file you can find. AeonSync organizes remote backups into dated directories under a machine's name, with a latest link pointing to the newest snapshot. The structure stays visible on the destination server, alongside metadata describing each backup.

The Python CLI wraps rsync over SSH. Incremental runs use rsync's link-dest mechanism to share unchanged files with an earlier snapshot through hard links. Daily naming keeps a simple sequence of dates; additional runs can receive numbered suffixes. A retention setting governs cleanup of older snapshots.

## Familiar tools, a clearer routine

AeonSync brings snapshot naming, transfer options, and backup listings into a single command-line workflow. Exclusion patterns leave regenerable files out of the transfer, while recorded rsync statistics provide a view of what the operation moved.

The approach suits file-based backups to a server or NAS with SSH and rsync available. Its dated directories can be inspected using ordinary filesystem tools, making the storage layout understandable without learning a separate archive format.

## Inspect a version before restoring it

The restore interface includes version selection, syntax-highlighted text previews, and comparisons against a local copy. Those views help answer a practical question: does this snapshot contain the version I meant to recover? A separate output location allows a restored copy to be reviewed alongside the current file.

AeonSync is a compact utility with a deliberately visible storage model. Its repository contains the backup and restore implementation, configuration options, and examples for evaluating the workflow against a particular setup.

[Read the backup workflow and restore options](https://github.com/hyperb1iss/aeonsync).
