---
title: "🌟 Hyper Light Card"
description: "A beautifully designed custom card for controlling SignalRGB in Home Assistant"
date: 2024-09-25
tags: ["home-assistant", "custom-card", "signalrgb", "smart-home"]
image: "/images/hyper-light-card-preview.jpg"
github: "https://github.com/hyperb1iss/hyper-light-card"
---

Elevate your Home Assistant dashboard with the Hyper Light Card – a stunningly beautiful and highly functional custom card designed specifically for controlling SignalRGB through Home Assistant.

![Hyper Light Card Preview](/images/hyper-light-card-preview.jpg)

## ✨ Features

- 🎨 Dynamic color adaptation based on the current SignalRGB effect
- 💡 Intuitive on/off toggle with visual feedback
- 🔀 Easy effect switching with a sleek dropdown menu
- 🔆 Smooth brightness control slider
- 📊 Detailed effect information display
- 🖼️ Live effect preview with background image
- 🔧 Expandable effect parameters section
- 🚀 Optimized performance with efficient rendering

## 🛠️ Installation

1. Install [HACS](https://hacs.xyz/) if you haven't already.
2. In HACS, go to "Frontend" and click the "+" button.
3. Search for "Hyper Light Card" and install it.
4. Add the card to your dashboard:
   ```yaml
   type: custom:hyper-light-card
   entity: light.signalrgb
   ```

## 🎛️ Configuration

| Option                    | Type    | Default                   | Description                                  |
| ------------------------- | ------- | ------------------------- | -------------------------------------------- |
| `entity`                  | string  | **Required**              | The entity_id of your SignalRGB light        |
| `name`                    | string  | `friendly_name` of entity | Card title                                   |
| `icon`                    | string  | SignalRGB logo            | Icon to display                              |
| `show_effect_info`        | boolean | `true`                    | Show effect description and publisher        |
| `show_effect_parameters`  | boolean | `true`                    | Display effect parameters                    |
| `show_brightness_control` | boolean | `true`                    | Show brightness slider                       |
| `background_opacity`      | number  | `0.7`                     | Opacity of the effect image background (0-1) |
| `allowed_effects`         | list    | All effects               | List of effects to show in the dropdown      |

## 🎨 Customization

The Hyper Light Card automatically adapts its color scheme based on the current SignalRGB effect, ensuring a cohesive and visually appealing dashboard. The card uses an advanced color extraction algorithm to determine the most suitable background, text, and accent colors for optimal readability and aesthetic appeal.

## 🚀 Performance

Hyper Light Card is built with performance in mind. It uses efficient rendering techniques and optimized state management to ensure smooth interactions, even on less powerful devices.
