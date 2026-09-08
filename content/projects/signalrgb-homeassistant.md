---
emoji: '🏠'
title: 'SignalRGB Home Assistant Integration'
date: '2024-09-25'
tags: ['Home Assistant', 'IoT', 'SignalRGB', 'Smart Home', 'Python']
description: 'Bring SignalRGB into Home Assistant with lighting, layout, and preset entities for dashboards, scenes, and everyday automations.'
github: 'https://github.com/hyperb1iss/signalrgb-homeassistant'
---

The lights around a computer can belong to the same routines as the rest of the room. The SignalRGB Home Assistant integration exposes a Windows PC's SignalRGB setup as native Home Assistant entities, making its lighting available to automations, scripts, and scenes.

A light entity handles power, brightness, and effect selection. Separate selectors switch device layouts and apply presets for the current effect. Buttons step forward or backward through effects, or choose one at random. A dashboard can offer the immediate controls; an automation can make the same changes when the room's routine calls for them.

## More than an on switch

Changing a room's mood often takes more than adjusting brightness. Layout selection changes how SignalRGB arranges the devices, while an effect preset recalls a particular variation. Exposing those operations as standard Home Assistant controls lets users combine them with the platform's existing automation tools.

Effect artwork and extracted colors travel with the lighting state. The companion [Hyper Light Card](/projects/hyper-light-card) uses that information to show the effect and adapt the dashboard's appearance around it.

## A native place in Home Assistant

The integration uses an asynchronous Python client and a shared update coordinator to fetch lighting state. Setup happens through Home Assistant's configuration flow, and installation is available through the default HACS catalog.

SignalRGB must be running on a reachable Windows PC with its HTTP API enabled. API access requires SignalRGB Pro; the integration is an independent community project.

[Read the setup guide and entity reference](https://github.com/hyperb1iss/signalrgb-homeassistant).
