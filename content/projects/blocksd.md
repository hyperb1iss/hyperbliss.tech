---
emoji: '🔌'
title: 'blocksd: Linux Daemon for ROLI Blocks'
description:
  'Keeps ROLI Blocks devices alive on Linux with full protocol support:
  topology, LED control, touch events, device config, and systemd integration.'
date: '2026-03-15'
github: 'https://github.com/hyperb1iss/blocksd'
tags: ['Python', 'Linux', 'MIDI', 'ROLI', 'Hardware', 'Daemon', 'asyncio']
---

ROLI Blocks need an active host-side handshake over MIDI SysEx to enter API mode. Without it, they show a searching animation and power off. There's no official Linux support.

blocksd implements the full ROLI Blocks protocol so your devices stay alive and useful on Linux.

## ✦ Features

| Capability                   | Description                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- |
| 🔌 **API Mode Keepalive**    | Periodic pings prevent the 5-second timeout that kills API mode               |
| 🏗️ **Topology Management**   | Auto-discovers devices over USB, tracks DNA-connected blocks through master   |
| 🎭 **Full State Machine**    | Serial, topology, API activation, ping loop, matching the C++ reference       |
| 💡 **LED Control**           | RGB565 bitmap grid with CLI patterns (solid, gradient, rainbow, checkerboard) |
| 👆 **Touch & Button Events** | Normalized touch data (x/y/z/velocity) and button callbacks                   |
| ⚙️ **Device Config**         | Read/write device settings (sensitivity, MIDI channel, scale)                 |
| 🔊 **DAW Friendly**          | ALSA multi-client: blocksd and your DAW share MIDI without conflict           |
| 🛡️ **systemd Integration**   | Type=notify service, watchdog heartbeat, udev rules for plug-and-play         |

## ⚡ Install

```bash
# Quick install (systemd + udev in one shot)
curl -fsSL https://raw.githubusercontent.com/hyperb1iss/blocksd/main/install.sh | bash

# PyPI
uv tool install blocksd
blocksd install

# Arch Linux (AUR)
yay -S blocksd
```

## 🎮 Usage

```bash
# Start the daemon
blocksd start

# List connected devices
blocksd devices

# Set LED pattern
blocksd led rainbow
blocksd led solid --color ff00ff

# Monitor touch events
blocksd touch --monitor
```

---

**Your Blocks, alive on Linux.**

