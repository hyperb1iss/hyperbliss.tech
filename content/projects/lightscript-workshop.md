---
emoji: '💡'
title: 'LightScript Workshop: Mind-Bending RGB Effects'
description:
  'Modern TypeScript framework for creating SignalRGB lightscripts. WebGL
  shaders, hot reloading, audio reactivity, and decorator-based controls.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/lightscript-workshop'
tags: ['TypeScript', 'WebGL', 'Three.js', 'GLSL', 'SignalRGB', 'RGB', 'Shaders']
---

## Overview

**LightScript Workshop** is a TypeScript framework for creating custom lighting
effects for SignalRGB, the app that unifies control of your RGB keyboards, mice,
headsets, and other PC peripherals.

Write your own effects using **WebGL shaders** or **Canvas 2D** with a modern
development experience.

## Features

| Feature            | Description                                            |
| ------------------ | ------------------------------------------------------ |
| **WebGL + Canvas** | GPU-accelerated shaders or traditional Canvas drawing  |
| **Decorators**     | `@NumberControl`, `@BooleanControl` for type-safe UI   |
| **Hot Reloading**  | Edit shader code, see it instantly                     |
| **Audio Reactive** | Built-in FFT analysis with bass/mid/treble helpers     |
| **AI-Native**      | Structured patterns that Claude and Copilot understand |
| **One Command**    | Build standalone HTML files that drop into SignalRGB   |

## Effect Gallery

| Effect             | What It Does                                      |
| ------------------ | ------------------------------------------------- |
| **Black Hole**     | Gravitational lensing with accretion disk         |
| **Voronoi Flow**   | Cellular patterns morphing with fluid dynamics    |
| **Quantum Foam**   | Planck-scale virtual particles popping in/out     |
| **Cyber Descent**  | Cyberpunk matrix rainfall with scanline artifacts |
| **Kaleido Tunnel** | Raymarched kaleidoscopic infinity tunnel          |
| **Audio Pulse**    | Reactive rings that pulse to your music           |
| **Neural Synapse** | Synaptic networks firing in cascading patterns    |

## Quick Start

```bash
git clone https://github.com/hyperb1iss/lightscript-workshop.git
cd lightscript-workshop
pnpm install
pnpm dev
```

Open [localhost:4096](http://localhost:4096) for live preview with controls.

## How It Works

Effects are TypeScript classes paired with GLSL fragment shaders:

```typescript
@Effect({ name: 'Neon Dreams', author: 'You' })
export class NeonDreams extends WebGLEffect<{ speed: number }> {
  @NumberControl({ label: 'Speed', min: 1, max: 10, default: 5 })
  speed!: number
}
```

The shader receives your control values as uniforms, no registration needed.

---

**If you can imagine it, you can build it.**
