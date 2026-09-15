---
category: 'lighting'
title: 'Hypercolor: A Canvas for Your Lights'
description: 'An open-source RGB engine that turns keyboards, LED strips, and room lighting into a shared canvas for shaders, music, and interaction.'
featured: 1
date: '2026-03-03'
github: 'https://github.com/hyperb1iss/hypercolor'
tags: ['Rust', 'RGB', 'Servo', 'wgpu', 'TypeScript', 'Linux', 'Windows', 'macOS']
---

A ripple of color should be able to travel from your keyboard to the lights behind your monitor. Hypercolor makes that spatial relationship part of the effect. You arrange supported devices on a canvas, and the engine samples the animation at each LED's position. A desk full of different hardware becomes a surface you can compose for.

Hypercolor is an open-source lighting engine for Linux, Windows, and macOS. Its driver system connects desktop peripherals and internal RGB hardware with networked lighting such as WLED, Philips Hue, and Nanoleaf. Hardware support varies by device and platform; the growing compatibility matrix distinguishes working drivers from devices still being researched.

## Light with a sense of place

The layout editor gives strips, matrices, and rings positions in the scene. A gradient can follow the width of a desk; a pulse can spread across several devices. Layered scenes let different areas carry their own effects while sharing the same composition.

Music and interaction give those scenes movement. The audio pipeline exposes frequency information and beat detection to effects. Interactive effects can respond to keyboard and mouse input after you enable capture. Screen-reactive lighting offers another way to connect what is happening on a display with the room around it.

## Meet SparkleFlinger

At the center is SparkleFlinger, Hypercolor's compositor. Effects produce surfaces at their own pace. The compositor takes each producer's latest completed surface, blends the layers, and prepares the frame for spatial sampling. GPU composition uses wgpu; the effect renderers have their own paths.

The compositor design leaves room for different kinds of artwork. An embedded Servo browser renders HTML Canvas and WebGL effects, including GLSL shaders. Native Rust renderers handle built-in effects without a browser in their rendering path. The TypeScript SDK supplies controls and live development tools for authors who want to make something new.

## Make the scene your own

The web interface brings together the effect catalog, layout editor, and live preview. A terminal interface offers device status and a color preview of its own. The [Home Assistant integration](/projects/hypercolor-hass/) connects the engine to household scenes and automations.

Hypercolor is in active development, with working effects and drivers alongside a larger hardware roadmap. The [project and installation guide](https://github.com/hyperb1iss/hypercolor) explain what runs today. The [effect-authoring guide](https://github.com/hyperb1iss/hypercolor/blob/main/docs/content/effects/creating-effects.md) is the place to start painting.
