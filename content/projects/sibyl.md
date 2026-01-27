---
emoji: '🔮'
title: 'Sibyl: Build With Agents That Remember'
description:
  'A collective intelligence runtime with persistent memory, agent
  orchestration, and knowledge graph-powered AI development.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/sibyl'
status: 'Active Development'
tags:
  [
    'Python',
    'TypeScript',
    'Claude',
    'AI Agents',
    'Knowledge Graph',
    'FalkorDB',
    'FastAPI',
    'Next.js',
    'MCP',
  ]
---

## 🌟 The Vision

AI agents that remember everything. A collective intelligence that compounds
with every session. Orchestration that lets you manage a fleet of autonomous
agents—all building on shared knowledge, all tracked in one place.

Today's agents have amnesia. Every session starts fresh. No memory of what
worked, what failed, what you learned yesterday. Multiple agents across
different features? Chaos.

**Sibyl changes that.**

## ✦ What You Get

| Capability                     | What It Means                                                   |
| ------------------------------ | --------------------------------------------------------------- |
| 🔮 **Collective Intelligence** | Every agent contributes. Every session compounds                |
| 🎯 **Semantic Search**         | Find knowledge by meaning, not just keywords                    |
| 🧠 **Persistent Memory**       | What you learn today helps tomorrow                             |
| ⚡ **Agent Orchestration**     | Spawn Claude agents that work autonomously with human approvals |
| 🦋 **Task Workflow**           | Plan with epics and tasks. Track parallel work across agents    |
| 📚 **Doc Ingestion**           | Crawl and index external documentation into your graph          |
| 🌐 **Graph Visualization**     | Interactive D3 visualization of your knowledge connections      |

## 🤖 Agent Orchestration

Sibyl's flagship feature: **spawn AI agents that work autonomously** while you
review and approve their actions.

- **Task Assignment** — Agents claim tasks and update status automatically
- **Git Worktrees** — Each agent works in isolation to prevent conflicts
- **Approval Queue** — Review and approve/deny agent actions before execution
- **Cost Tracking** — Monitor token usage and USD cost per agent
- **Checkpointing** — Save/restore agent state for crash recovery
- **Multi-Agent** — Multiple agents can collaborate on related tasks

## 🛠️ Technical Stack

- **Backend:** Python 3.13 / FastMCP / FastAPI / Graphiti / FalkorDB
- **Frontend:** Next.js 16 / React 19 / React Query / Tailwind 4
- **Database:** FalkorDB (graph) + PostgreSQL (relational)
- **Build:** moonrepo + uv (Python) + pnpm (TypeScript)
- **Agents:** Claude SDK with human-in-the-loop approvals

## ⚡ Quick Start

```bash
# One-liner install
curl -fsSL https://raw.githubusercontent.com/hyperb1iss/sibyl/main/install.sh | sh

# Or via uv
uv tool install sibyl-dev
sibyl local start
```

## 🌐 MCP Integration

Connect Claude Code, Cursor, or any MCP client to Sibyl with a simple 4-tool
API: `search`, `explore`, `add`, and `manage`. Ships with Claude Code skills and
hooks for seamless integration.

---

The collective gets smarter. The orchestration gets deeper. **Build with agents
that remember.**
