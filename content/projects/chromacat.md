---
category: 'terminal'
emoji: '😺'
title: 'ChromaCat: Color in Motion'
date: '2024-09-25'
tags: ['Rust', 'CLI', 'Terminal', 'Generative Art', 'Open Source']
description: 'A Rust terminal colorizer with animated gradients, procedural patterns, and an interactive playground for turning ordinary text into moving color.'
github: 'https://github.com/hyperb1iss/chromacat'
---

A terminal is a grid of characters. ChromaCat treats that grid as a small canvas: waves travel through text, plasma rolls across a banner, and a quiet gradient gives an ordinary command a little more presence. Written in Rust, it colorizes files and piped input, with an interactive playground for exploring what happens when color starts to move.

The appeal is immediate, but the controls go deeper than picking a palette. Patterns describe how color moves through space; themes supply the colors. Keeping those choices separate means the same ripple can feel like cold water, a neon sign, or a pastel wash.

## A little procedural art in the shell

The pattern engine includes spirals, fire, aurora, and organic noise alongside directional gradients. Parameters expose the character of an effect, so a wave can become broad and gentle or tightly wound. Custom YAML themes let the palette belong to you, and playlists arrange patterns into sequences.

The playground brings those choices into an animated terminal interface. Piped input can join the playground too, making your own text part of the experiment. For everyday shell use, ChromaCat also works as a colorizing step in a pipeline.

## Small surface, real rendering work

The project connects procedural graphics with the constraints of terminal output: character positions, terminal dimensions, input streams, and animation timing. A registry gives patterns their own parameters while exposing them through a common command-line interface. Adding another effect extends the visual vocabulary without inventing a new way to use the tool.

Browse the patterns and usage guide in the [ChromaCat repository](https://github.com/hyperb1iss/chromacat).
