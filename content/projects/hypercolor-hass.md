---
category: 'lighting'
title: 'Hypercolor for Home Assistant'
description: 'Bring Hypercolor effects, spatial layouts, and live lighting controls into Home Assistant scenes, dashboards, and automations.'
date: '2026-05-05'
github: 'https://github.com/hyperb1iss/hypercolor-hass'
tags: ['Python', 'Home Assistant', 'Hypercolor', 'RGB', 'WebSocket', 'Smart Home']
---

The lights on your desk can participate in the rest of your home. Hypercolor for Home Assistant connects the [Hypercolor engine](/projects/hypercolor/) to the scenes, scripts, and automations you already use. An evening routine could dim your room and switch your desk to a softer effect, with the lighting engine still responsible for the animation.

The integration represents each Hypercolor daemon as a hub. A master light controls output and brightness, while scenes, layouts, and presets become native Home Assistant entities. Individual hardware devices can also be enabled as child light entities when you want separate control.

## Controls that preserve the scene

Turning off the master light pauses output while keeping the current scene and its settings. Turning it back on resumes that state. Clearing the scene is a separate action, so a simple light switch does not undo the composition you have arranged.

Effect controls such as speed, hue shift, and intensity appear as sliders. Named scenes and catalog effects are exposed as scene entities, giving automations direct ways to select a look. Optional audio entities let you use energy and beat information elsewhere in Home Assistant.

## Stay connected to the engine

Local discovery helps Home Assistant find a daemon on the network. A WebSocket connection carries change notifications, and the integration reconciles its entities with the daemon's current state. Effects and scenes can appear or disappear as the catalog changes. Diagnostics and repair flows make connection and authentication problems visible.

The companion [Hyper Light Card](/projects/hyper-light-card/) provides a visual dashboard for browsing effects and adjusting the scene. Together, the integration and card bring the engine's richer controls into the place you already manage your home.

The [repository](https://github.com/hyperb1iss/hypercolor-hass) includes HACS setup, supported daemon requirements, and example automations.
