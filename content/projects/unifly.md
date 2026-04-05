---
emoji: '🌐'
title: 'unifly: Your UniFi Network, at Your Fingertips'
description:
  'Elegant UniFi network management CLI & TUI — 26 commands, 10-screen
  dashboard, dual API engine, for humans and AI agents alike.'
date: '2026-02-13'
github: 'https://github.com/hyperb1iss/unifly'
tags: ['Rust', 'CLI', 'TUI', 'Ratatui', 'Networking', 'UniFi', 'Agent Skills']
---

A complete command-line toolkit for managing Ubiquiti UniFi network controllers.
One binary with 26 top-level commands for scripting and a built-in TUI dashboard
for real-time monitoring, powered by a shared async engine that speaks every
UniFi API dialect.

## ✦ Features

| Capability                | What You Get                                                                   |
| ------------------------- | ------------------------------------------------------------------------------ |
| 🔮 **Dual API Engine**    | Integration API (REST) + Legacy API (session/CSRF) with automatic negotiation  |
| ⚡ **Real-Time TUI**      | 10-screen dashboard with traffic charts, CPU/MEM gauges, zoomable topology     |
| 🦋 **26 Commands**        | Devices, clients, networks, WiFi, firewall, zones, ACLs, NAT, DNS, VPN, DPI... |
| 💎 **Flexible Output**    | Table, JSON, YAML, and plain text — pipe-friendly for scripting                |
| 🔒 **Secure Credentials** | OS keyring storage for API keys and passwords                                  |
| 🌐 **Multi-Profile**      | Named profiles for multiple controllers, switch with a single flag             |
| 📡 **WebSocket Events**   | Live event streaming with 10K rolling buffer and severity filtering            |
| 📊 **Historical Stats**   | WAN bandwidth area fills, client counts, DPI app/category breakdown            |
| 🎨 **SilkCircuit Theme**  | Neon-on-dark palette powered by opaline with ANSI fallback                     |

## 🤖 Dual Personality

**AI agents** get a dedicated skill bundle with full CLI reference and a
ready-made network manager agent that can provision VLANs, audit firewalls, and
diagnose connectivity:

```bash
npx skills add hyperb1iss/unifly
```

**Humans** get a gorgeous TUI, shell completions, pipe-friendly output, and the
quiet satisfaction of never opening the UniFi web UI again.

## ⚡ Quick Start

```bash
# Install
curl -fsSL https://raw.githubusercontent.com/hyperb1iss/unifly/main/install.sh | sh

# Interactive setup wizard
unifly config init

# Go
unifly devices list          # All adopted devices
unifly clients list          # Connected clients
unifly networks list         # VLANs and subnets
unifly events watch          # Live event feed
unifly tui                   # Launch the dashboard
```

---

**Manage your entire network without leaving the terminal.**
