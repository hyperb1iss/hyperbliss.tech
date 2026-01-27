---
emoji: '🌈'
title: 'UChroma: RGB Control for Razer on Linux'
description:
  'Full-featured Razer Chroma peripheral control for Linux with custom
  animations, GTK4 frontend, and D-Bus API.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/uchroma'
tags: ['Python', 'Rust', 'Linux', 'RGB', 'Razer', 'GTK4', 'D-Bus', 'asyncio']
---

## 🔮 Overview

The Razer Chroma line of peripherals have flashy features such as embedded LED
matrices and macro keys. **UChroma** provides rich support for these features
under Linux without requiring kernel modifications.

_Back after 9 years—now with GTK4, modern Python, and Rust-powered USB/HID!_

## ✦ What It Can Do

- Supports Razer keyboards, mice, mouse pads, laptops, headsets, and keypads
- Enables activation of built-in hardware lighting effects
- Several custom effects included for devices with LED matrices
- Rich animation/framebuffer API for creation of custom effects
- **GTK4 frontend** with live LED matrix preview
- Fan control and power management for laptops
- Battery monitoring for wireless devices
- Optimized for low power consumption
- Powerful command line interface
- D-Bus API for integration
- 100% asyncio-powered Python, 100% open source (LGPL)

## 📦 Installation

```bash
# Ubuntu/Debian (PPA)
sudo add-apt-repository ppa:hyperb1iss/ppa
sudo apt install uchroma

# Arch Linux (AUR)
yay -S uchroma

# PyPI
pipx install uchroma
```

## ⚡ Usage

```bash
# List devices
uchroma -l

# Activate an effect
uchroma -d 0 fx fire --color magenta

# Start an animation
uchroma -d 0 anim add plasma --color_scheme newer

# Add another layer
uchroma -d 0 anim add ripples
```

## 🎨 Custom Animations

UChroma supports custom animations on devices with LED matrices. Multiple
concurrent (stacked) animations are supported with alpha blending. Animations
can run at different frame rates and trigger from input events or sound.

Included renderers: **plasma**, **rainflow**, **ripples**, and more.

## 🧪 Powered By

- Numpy for matrix operations
- ColorAide for color math
- dbus-fast for async D-Bus
- nusb (Rust) for USB/HID communication

---

**Make your Razer hardware shine under Linux.**
