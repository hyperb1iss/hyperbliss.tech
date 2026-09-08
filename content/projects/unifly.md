---
emoji: '📡'
title: 'unifly: UniFi from the Terminal'
description: 'A Rust CLI and live terminal dashboard for UniFi networks, from switch ports and firewall policies to Wi-Fi diagnostics and cloud-managed sites.'
date: '2026-02-13'
github: 'https://github.com/hyperb1iss/unifly'
tags: ['Rust', 'CLI', 'TUI', 'Ratatui', 'Networking', 'UniFi', 'Agent Skills']
---

A network question usually starts small. Which access point has this client? What changed on that switch port? Why did the device roam? The unifly toolkit puts those questions within reach of a terminal, with commands for focused work and an interactive dashboard for watching the network as a whole.

The CLI covers device and client management, network configuration, and firewall policy. Wi-Fi diagnostics expose neighboring access points, experience scores, and client roaming history. Named profiles let the same tool move between controllers, with Site Manager support for cloud-managed fleets.

## One interface across UniFi's APIs

UniFi exposes different capabilities through its Integration API, session-based endpoints, and cloud services. A shared asynchronous Rust library handles those paths beneath the CLI and dashboard. Authentication support includes API keys, session credentials, and a hybrid mode for live WebSocket events.

The shared API layer gives both interfaces access to the same network models and operations. Structured JSON and YAML output support scripts, while readable tables serve an operator checking a device by hand. A bundled agent skill documents commands and workflows for coding assistants.

## Watch the shape of the network

The Ratatui dashboard combines traffic history, device health, live events, and a zoomable topology view. SilkCircuit colors distinguish the interface's controls and data, with terminal graphics support where available and text-based rendering for other environments.

Configuration work stays close to observation: inspect port state, review policies, then make a targeted change through the same toolkit. The result is a substantial network management surface that fits the way terminal users already work.

[Explore the commands, dashboard tour, and authentication guide](https://github.com/hyperb1iss/unifly).
