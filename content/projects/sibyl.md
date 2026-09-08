---
emoji: '🧿'
title: 'Sibyl: Memory That Follows Your Work'
description: 'Self-hosted memory for coding agents, connecting project decisions, debugging lessons, tasks, and source material across tools and sessions.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/sibyl'
tags: ['Python', 'TypeScript', 'AI Agents', 'Knowledge Graph', 'SurrealDB', 'FastAPI', 'Next.js', 'MCP']
---

A difficult debugging session leaves more behind than a patch. There is the failed approach, the constraint nobody had written down, and the reason the final fix works. Sibyl gives that knowledge a place to live, so another session or another coding agent can pick it up.

Sibyl is my self-hosted memory system for work that moves between tools. Claude Code, Codex, and other agents can read from and contribute to the same project knowledge through a CLI or MCP. Decisions and debugging lessons remain connected to tasks and source material, with a web interface for the humans keeping track of the work.

## Keep the reasoning close

The central workflow is deliberately small. Ask for context before starting, capture useful knowledge as it emerges, and reflect on a session when there is something worth keeping. Context packs collect relevant memory around a concrete goal, so an agent can begin with the decisions that bear on its task.

Underneath, retrieval combines semantic matches with graph relationships and signals such as recency. A memory can lead to the related decision, the task it informed, or the source that supports it. Original captures remain available alongside the derived knowledge, preserving a way to inspect where a claim came from.

The same system can ingest documentation and agent transcripts. Its synthesis tools draft documents from authorized memory and check citations, freshness, and gaps. The practical value is continuity: the explanation behind yesterday's work can become part of today's starting point.

## A system you can run yourself

Sibyl uses SurrealDB for graph, content, and authentication storage, with a Python API and a Next.js interface. The web workspace brings together memory search, a navigable graph, and task tracking. Project and organizational scopes determine where knowledge belongs and who can access it.

Agent guidance ships with the CLI and matches the installed version. Changing coding tools does not require rebuilding the memory workflow around a new integration. The [Sibyl repository](https://github.com/hyperb1iss/sibyl) includes installation paths for a local daemon, containers, and larger self-hosted deployments.
