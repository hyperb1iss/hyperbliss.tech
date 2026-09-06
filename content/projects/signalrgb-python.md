---
category: 'lighting'
emoji: '💡'
title: 'signalrgb-python: Python Library for SignalRGB'
date: '2024-09-25'
tags: ['Python', 'SignalRGB', 'API', 'CLI', 'RGB', 'Lighting']
description: 'A Python client and terminal interface for SignalRGB Pro, with synchronous and asynchronous control of effects, presets, layouts, and brightness.'
github: 'https://github.com/hyperb1iss/signalrgb-python'
---

A lighting effect can be part of a script, an application, or a larger home automation system. The signalrgb-python library provides the connection: a Python interface to SignalRGB Pro's REST API, with a terminal client for the same everyday operations.

You can browse and search effects, apply a preset, switch the active device layout, or adjust the lighting canvas. The CLI makes those actions available from a shell, including next, previous, and random effect selection. A small script can use the synchronous client; an application already running an event loop can use the asynchronous client.

## An API that fits its caller

The two clients cover the same core lighting concepts without forcing every consumer into one execution model. The asynchronous implementation uses an HTTP client with context-managed connections, making it suitable for integrations such as [SignalRGB for Home Assistant](/projects/signalrgb-homeassistant).

Typed models describe effects and layouts. Dedicated exceptions distinguish connection failures from API errors and missing resources, so an application can respond to the actual problem. Effect caching supports repeated navigation through the library without treating every lookup as a fresh catalog request.

## A useful piece of the lighting stack

The library handles communication with SignalRGB while leaving the sequence and timing of changes to the calling application. That makes it useful for both a single terminal command and custom lighting behavior tied to another system.

SignalRGB Pro is required for API access. The library is independently developed and maintained, with client documentation and examples alongside the source.

[Explore the Python API and CLI documentation](https://hyperb1iss.github.io/signalrgb-python/).
