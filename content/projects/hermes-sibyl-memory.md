---
emoji: '🧠'
title: 'Sibyl Memory for Hermes'
description: 'A Hermes Agent memory provider that recalls project context, preserves completed conversations, and queues writes durably through Sibyl.'
date: '2026-07-26'
github: 'https://github.com/hyperb1iss/hermes-sibyl-memory'
tags: ['Python', 'Hermes Agent', 'Sibyl', 'AI Agents', 'SQLite', 'Memory']
---

An agent returning to a project needs more than the last conversation. Decisions, corrections, and useful context may have accumulated across several sessions. Sibyl Memory for Hermes connects Hermes Agent to [Sibyl's persistent memory](/projects/sibyl/), while keeping Hermes' local memory files and session search available.

At the start of a turn, the provider requests a compact context pack for the configured project. The connection is bound to a specific project, memory space, and agent identity, giving the shared memory layer an explicit scope.

## Remember the conversation that happened

Automatic capture records completed user messages and final assistant responses. Tool calls, tool results, recalled context, and interrupted turns are excluded from that capture. The boundary preserves the conversation itself without treating every intermediate operation as something the agent should remember.

Delivered context is acknowledged separately, so the memory service can distinguish what was requested from what actually reached the agent. Corrections use the same durable delivery path as new memories.

## Recovery is part of the design

Before a mutation leaves the machine, it enters a SQLite outbox. Stable operation identities and per-session ordering let pending work survive a restart or an interrupted connection. Authentication problems can leave operations queued for recovery, with status and diagnostic commands showing what needs attention.

Context recall has a different responsibility: a slow memory service should not prevent the conversation from continuing. The provider can proceed without automatic context and leave manual recall available. Local conversation history remains useful while the shared service recovers.

The [provider repository](https://github.com/hyperb1iss/hermes-sibyl-memory) documents setup, supported Hermes versions, and the commands for inspecting and recovering the outbox.
