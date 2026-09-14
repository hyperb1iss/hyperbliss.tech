---
category: 'lighting'
title: 'UChroma: Razer Lighting on Linux'
description: 'A Linux driver and animation system for Razer Chroma, pairing hardware control with layered effects, a GTK4 interface, and a D-Bus API.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/uchroma'
tags: ['Python', 'Rust', 'Linux', 'RGB', 'Razer', 'GTK4', 'D-Bus', 'asyncio']
---

A keyboard's LED matrix is a small canvas hiding in plain sight. UChroma gives Linux users control over that canvas, along with the lighting and device features of supported Razer Chroma hardware, without requiring kernel modifications.

The background daemon discovers devices, handles hardware communication, runs animations, and stores preferences. A command-line interface exposes those capabilities for direct control and scripting. The GTK4 frontend adds a live LED matrix preview, making it easier to see how an effect will occupy the device.

## Color with depth

UChroma supports both the effects built into a device's firmware and custom animations rendered on the host. The custom renderer treats animations as layers: plasma can move beneath ripples, with blending and opacity shaping the combined image. Layers can run at different frame rates, and the rendering API provides access to input events for reactive effects.

Separate renderers give a simple hardware effect and a custom composition their own appropriate paths. Device capabilities still matter: a keyboard matrix, a mouse logo, and a laptop's lighting zones offer different possibilities.

## A Linux service with an open interface

Python's asyncio runtime coordinates the daemon, while Rust handles USB communication through nusb. D-Bus exposes device control to other applications, so the desktop interface and command line share the same service.

Support extends beyond color where the hardware allows it, including wireless battery monitoring and laptop fan and power controls. The device reference documents model coverage and available features.

[Browse supported devices and the animation development guide](https://github.com/hyperb1iss/uchroma/tree/main/docs).
