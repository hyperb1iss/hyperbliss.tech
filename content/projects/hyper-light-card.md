---
category: 'lighting'
title: 'Hyper Light Card'
description: 'An adaptive Home Assistant card for SignalRGB and Hypercolor, with effect artwork, scene controls, audio settings, and per-zone lighting.'
date: '2024-09-25'
tags: ['Home Assistant', 'TypeScript', 'Lit', 'SignalRGB', 'Hypercolor', 'Smart Home']
github: 'https://github.com/hyperb1iss/hyper-light-card'
---

Lighting deserves an interface with a little of its own atmosphere. Hyper Light Card brings SignalRGB and Hypercolor into Home Assistant through a card that takes its color from the running effect. Artwork sets the background; extracted colors guide the accents and readable foreground text.

Power, brightness, and effect selection stay close at hand. Open the details to see the effect's description, publisher, and controls. The card adapts to the connected lighting system, so each backend gets an interface suited to what it can actually do.

## From an effect to a room

For SignalRGB, the card adds layout and preset selection alongside effect navigation. For Hypercolor, the view expands to scenes, live effect controls, and audio input selection. Zone controls let you adjust brightness and power for separate render groups, while a device view exposes individual lights within a larger installation. Status chips show connectivity, frame rate, and audio activity.

Companion controls are discovered through Home Assistant's device and entity registries. Renaming an entity does not sever its relationship with the correct Hypercolor instance, and explicit configuration remains available for unusual setups.

## Detail without clutter

The Lit-based interface includes keyboard navigation, visible focus states, and a visual configuration editor. Its layout accommodates mobile dashboards and Home Assistant sections. When effect artwork cannot supply a usable palette, the card falls back to the dashboard theme.

The result is a lighting control surface with room for both a quick brightness change and a deeper evening of tuning.

[See the card, screenshots, and configuration guide](https://github.com/hyperb1iss/hyper-light-card).
