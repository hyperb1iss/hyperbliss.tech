---
emoji: '💡'
title: 'LightScript Workshop: A Studio for RGB Effects'
description: 'Write lighting effects in TypeScript and GLSL, preview them in a browser, and build standalone lightscripts for SignalRGB.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/lightscript-workshop'
tags: ['TypeScript', 'WebGL', 'Three.js', 'GLSL', 'SignalRGB', 'RGB', 'Shaders']
---

A black hole bending light around its center. Cellular patterns sliding past one another. Rings opening on the beat. LightScript Workshop is a place to turn those visual ideas into effects for SignalRGB-controlled hardware.

The framework pairs TypeScript with WebGL shaders or Canvas 2D drawing. Its development playground offers a live preview and adjustable controls, with hot reloading to keep changes close to their visual result. When an effect is ready, the build produces a standalone HTML lightscript for SignalRGB.

## The controls belong with the effect

An effect is defined as a TypeScript class. Decorators describe the controls a user can adjust, including numeric values, switches, and colors. That metadata generates the SignalRGB control interface, keeping the effect's behavior and its public controls together.

The WebGL base class provides rendering through Three.js, along with time and audio uniforms. An effect can use audio levels and frequency bands to drive movement or brightness. Canvas effects offer another route for work better expressed through drawing commands.

## A collection to learn from

The included gallery gives the framework a visual vocabulary: the accretion disk of Black Hole, the shifting cells of Voronoi Flow, the recursive geometry of Kaleido Tunnel, and the music-driven rings of Audio Pulse. Each is source material to inspect, adapt, or take in a different direction.

The interesting work lives in that loop between code and perception. A parameter becomes a gesture; a shader becomes a field of color across physical devices. The workshop supplies the preview, controls, and packaging so an author can stay with the effect.

[Try the browser playground](https://hyperb1iss.github.io/lightscript-workshop/playground/) or [read the effect development guide](https://hyperb1iss.github.io/lightscript-workshop/).
