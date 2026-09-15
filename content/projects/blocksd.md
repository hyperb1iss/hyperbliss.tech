---
category: 'lighting'
title: 'blocksd: ROLI Blocks on Linux and macOS'
description: 'A host daemon that keeps ROLI Blocks connected, drives their LEDs, and exposes touch events to creative software on Linux and macOS.'
date: '2026-03-15'
github: 'https://github.com/hyperb1iss/blocksd'
tags: ['Python', 'Linux', 'MIDI', 'ROLI', 'Hardware', 'Daemon', 'asyncio']
---

A Lightpad is a small, expressive instrument: a glowing surface that responds to position, pressure, and movement. Getting that surface to work outside ROLI's software means handling the conversation underneath it. Devices need a host handshake and regular keepalive messages before their application interface stays available.

The blocksd daemon handles that conversation on Linux and macOS. It discovers USB-connected Blocks, follows the magnetic DNA connections between devices, and maintains their operating state. A live web dashboard makes the result visible through device topology, battery status, and LED state.

## A bridge from protocol to play

For Lightpad devices, blocksd exposes an LED grid; LUMI Keys gets individual key colors. Touch and button events travel back to applications, alongside device configuration controls for settings such as sensitivity and MIDI channel. Local software can connect through a Unix socket, while the dashboard and other clients use WebSocket.

The implementation reaches into the device itself. A small assembler produces LittleFoot programs that render incoming colors on the hardware. The daemon waits for upload acknowledgements and an execution check before sending pixels, keeping protocol acceptance distinct from a device being ready to display them.

## Built around the hardware

Python's asyncio runtime coordinates device discovery, messages, and client connections. Linux uses ALSA and a systemd user service; macOS uses CoreMIDI and a LaunchAgent. Lighting has been verified on Lightpad Block M and LUMI Keys, with device-specific evidence recorded in the documentation.

[Explore the protocol, supported hardware, and client API](https://hyperb1iss.github.io/blocksd/).
