---
emoji: '⚡'
title: 'Vigil: Keep Your Pull Requests Moving'
description: 'A terminal workspace for tracking GitHub reviews, CI, and conflicts, with specialized agents to help move pull requests toward merge.'
date: '2026-02-19'
github: 'https://github.com/hyperb1iss/vigil'
tags: ['TypeScript', 'Bun', 'Ink', 'GitHub', 'AI Agents', 'TUI', 'Developer Tools']
---

Writing the code is only part of finishing a pull request. Reviews arrive between other tasks, CI fails after you have switched repositories, and a branch falls behind while you are working elsewhere. Vigil brings those loose ends into a terminal workspace where you can see what needs attention and act on it.

The dashboard tracks your authored pull requests alongside incoming reviews. GitHub signals feed a state machine that separates actionable work from requests waiting on someone else. Search and repository filters help you find a particular change without opening a trail of browser tabs.

## From a signal to a useful action

Vigil uses specialized agents to handle different parts of the review cycle. Triage interprets the current situation. Other agents can work on review feedback, prepare replies, help rebase a branch, or fill in verification evidence. A learning agent captures patterns after a merge for future work.

The separation matters when several things happen at once. A failing check needs its logs and code context; a reviewer question needs the surrounding conversation. Vigil gives those tasks distinct roles and presents their proposed actions in the same interface. Code-changing work uses Git worktrees to establish the branch context.

## Keep a hand on the controls

The default mode queues actions for approval. You can inspect the proposal before it runs, skip it, or approve the next step from the action panel. An optional automatic mode handles eligible actions while preserving actions marked for confirmation and per-repository approval rules.

Vigil can also run as a dashboard without agents. The SilkCircuit interface supports keyboard navigation, a detailed PR view, and desktop notifications for events such as failing CI or blocking reviews. The result is a place to return to between stretches of coding, with the review work gathered and ready.

[Explore Vigil on GitHub](https://github.com/hyperb1iss/vigil) for the setup guide, agent configuration, and dashboard controls.
