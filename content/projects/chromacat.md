---
emoji: '😺'
title: 'ChromaCat: Turbocharged Terminal Colorizer'
date: '2024-09-25'
tags: ['Rust', 'CLI', 'Terminal', 'Open Source']
description:
  'A turbocharged terminal colorizer written in Rust. Think lolcat with
  superpowers: advanced gradient patterns, smooth animations, and 40+ themes.'
github: 'https://github.com/hyperb1iss/chromacat'
---

ChromaCat is a turbocharged terminal colorizer written in Rust that brings
gradient patterns and animations to your command-line experience. Think `lolcat`
but with superpowers: advanced gradient patterns, smooth animations, and
extensive customization options.

## Key Features

- **Rich Pattern Library**: Twelve distinct pattern types from simple gradients
  to complex effects
- **40+ Built-in Themes**: Everything from classic rainbow to custom color
  schemes
- **Smooth Animations**: Fluid color transitions for your terminal
- **Interactive Mode**: Real-time control over animations and effects
- **Precise Control**: Fine-tune every aspect of your gradients
- **Blazing Fast**: Optimized Rust implementation with minimal overhead
- **Full Unicode Support**: Works with emojis and international text
- **Terminal-Aware**: Adapts to terminal dimensions and capabilities

## Pattern Types

ChromaCat offers twelve unique pattern types for dynamic colorization:

- `diagonal` - Angled gradient with customizable direction
- `plasma` - Psychedelic plasma effect using sine waves
- `ripple` - Concentric circles emanating from center
- `wave` - Flowing wave distortion pattern
- `spiral` - Hypnotic spiral pattern from center
- `checkerboard` - Alternating gradient colors in a grid
- `diamond` - Diamond-shaped gradient pattern
- `perlin` - Organic, cloud-like noise pattern
- `rain` - Matrix-style digital rain effect
- `fire` - Dynamic flame simulation
- `aurora` - Northern lights simulation

## Usage Examples

```bash
# Basic usage with cyberpunk theme
echo "Hello, ChromaCat!" | chromacat -t cyberpunk

# Add some animation
cat your_file.txt | chromacat -a

# Wave pattern with custom parameters
chromacat -p wave --param amplitude=1.5,frequency=2.0 file.txt

# Matrix-style digital rain
chromacat -p rain --param "speed=1.5,density=2.0,length=5,glitch=true"

# Colorful git status
git status | chromacat -p ripple -t neon

# Build logs with style
cargo build 2>&1 | chromacat -p plasma -t matrix
```

## Theme Categories

### Space Themes

Cosmic-inspired gradients for sci-fi interfaces:

- **nebula**: Deep purples and cosmic blues
- **cosmos**: Starry nights and celestial hues
- **aurora**: Dancing northern lights
- **galaxy**: Swirling cosmic patterns

### Tech Themes

Cyberpunk-inspired themes for your digital workspace:

- **matrix**: Classic digital rain
- **cyberpunk**: Neon city vibes
- **quantum**: Ethereal data streams
- **hackerman**: Elite hacker aesthetics

### Aesthetic Themes

Stylish gradients for creative and artistic applications:

- **pastel**: Soft, dreamy color transitions
- **neon**: Vibrant, electrifying hues
- **retrowave**: 80s-inspired color schemes
- **vaporwave**: Modern retro aesthetics

### Party Themes

Energetic themes that bring celebration to your terminal:

- **rave**: Pulsating neon colors
- **disco**: Classic party vibrancy
- **festival**: Euphoric color combinations
- **carnival**: Playful, festive gradients
