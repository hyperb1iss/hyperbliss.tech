---
category: 'web'
title: 'next-dynenv: Configuration at Deployment Time'
description: 'My maintained fork of next-runtime-env, providing runtime public configuration and typed environment helpers for server-rendered Next.js applications.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/next-dynenv'
tags: ['TypeScript', 'Next.js', 'React', 'Environment', 'DevOps', 'npm']
---

Promoting an application from staging to production should not require a different build just to change its API address. My maintained fork, next-dynenv, lets a server-rendered Next.js application read public configuration from its running environment and make those values available to browser code.

The project builds on [next-runtime-env by Expatfile.tax](https://github.com/expatfile/next-runtime-env), preserving credit for the original implementation and approach. My fork updates the integration for newer Next.js and React releases and provides additional helpers for working with environment values.

## One artifact, different environments

The public environment script is an async server component. It opts into dynamic rendering, reads the server's public environment variables, and writes them into the page for the browser to consume. A container can therefore use the same application build with different configuration supplied at deployment.

The rendering model is part of the contract: runtime injection needs a server-rendered context. A pre-generated static export cannot pick up a host's new environment variables merely because those variables were changed after the files were built.

## Make configuration explicit

A shared accessor reads from the appropriate environment on the server or in the browser. Required-value helpers report missing configuration, while parsers handle common conversions such as booleans, numbers, and enumerated values. A server-only helper returns a fallback in the browser for shared modules that also refer to private configuration.

The standard public script selects variables with the NEXT_PUBLIC_ prefix. Its generated values are escaped for HTML and frozen in the browser, and a nonce can be supplied for Content Security Policy integration.

The [next-dynenv repository](https://github.com/hyperb1iss/next-dynenv) includes examples and configuration guidance for adopting the library in an existing application.
