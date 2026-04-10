---
emoji: '🌈'
title: 'signalrgb-python: Python Library for SignalRGB'
date: '2024-09-25'
tags: ['Python', 'SignalRGB', 'API', 'CLI', 'RGB', 'Lighting']
description: 'Python library and CLI for programmatic control of SignalRGB Pro lighting.
  Effect management, brightness control, layout switching, and sequencing.'
github: 'https://github.com/hyperb1iss/signalrgb-python'
---

## Programmatic RGB Control

signalrgb-python provides a Python interface for SignalRGB Pro, enabling programmatic control of your RGB lighting ecosystem. Build automation tools, create ambient notifications, or integrate lighting effects into your applications with a clean, typed API.

## Key Features

- **Effect Management**: Apply and control lighting effects programmatically
- **Layout Control**: Switch between different lighting configurations
- **Brightness Control**: Adjust lighting intensity
- **Preset Management**: Store and load lighting configurations
- **CLI Interface**: Control your setup through the terminal
- **Python API**: Full programmatic control with type hints
- **Effect Sequencing**: Create dynamic lighting sequences

## Python API

```python
from signalrgb import SignalRGBClient

client = SignalRGBClient()

# Apply an effect
client.apply_effect_by_name("Ocean Waves")

# Adjust brightness
client.brightness = 75

# Switch layouts
client.current_layout = "Development Setup"

# Sequence through effects
for effect in client.get_effects():
    client.apply_effect(effect.id)
    time.sleep(5)
```

## Command Line Interface

```bash
# List available effects
signalrgb effect list

# Apply an effect
signalrgb effect apply "Electric Dreams"

# Set brightness
signalrgb canvas brightness 75

# Enable RGB control
signalrgb canvas enable
```

## Installation

```bash
pip install signalrgb
```

For detailed usage instructions and API documentation, visit the [documentation](https://hyperb1iss.github.io/signalrgb-python/).

---

_signalrgb-python is an independent project and is not officially associated with SignalRGB. For official SignalRGB support and information, please visit [signalrgb.com](https://www.signalrgb.com)._
