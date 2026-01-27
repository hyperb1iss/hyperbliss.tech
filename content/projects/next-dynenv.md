---
emoji: '🌐'
title: 'next-dynenv: Runtime Environment Variables for Next.js'
description:
  'Dynamic runtime environment variables for Next.js 15/16 & React 19. Build
  once, deploy many.'
date: '2025-01-26'
github: 'https://github.com/hyperb1iss/next-dynenv'
tags: ['TypeScript', 'Next.js', 'React', 'Environment', 'DevOps', 'npm']
---

## ✨ Overview

**next-dynenv** dynamically injects environment variables into your Next.js
application at runtime. This approach adheres to the "build once, deploy many"
principle, allowing the same build to be used across various environments
without rebuilds.

A Next.js 15/16 & React 19 compatible fork of next-runtime-env.

## 🎯 Highlights

- **Isomorphic Design:** Works seamlessly on server, browser, and middleware
- **Next.js 15/16 & React 19 Ready:** Fully compatible with async server
  components
- **`.env` Friendly:** Use `.env` files during development
- **Type-Safe Parsers:** Convert strings to booleans, numbers, arrays, JSON,
  URLs, enums
- **Secure by Default:** XSS protection, immutable values with `Object.freeze`
- **Zero Config:** Works out of the box

## 🚀 Quick Start

```tsx
// app/layout.tsx
import { PublicEnvScript } from 'next-dynenv'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <PublicEnvScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// Use anywhere
import { env, requireEnv, envParsers } from 'next-dynenv'

const apiUrl = env('NEXT_PUBLIC_API_URL')
const debug = envParsers.boolean('NEXT_PUBLIC_DEBUG')
const port = envParsers.number('NEXT_PUBLIC_PORT', 3000)
```

## 🔒 Security Features

- **XSS Protection:** All values JSON-escaped before injection
- **Immutable Runtime:** Values wrapped with `Object.freeze()`
- **Strict Prefix Enforcement:** Only `NEXT_PUBLIC_*` exposed to browser
- **Server-Only Helper:** `serverOnly()` for graceful client-side fallbacks

## 🚀 Deployment Ready

Works seamlessly with Docker, Vercel, Netlify, AWS Amplify, and any static
hosting platform. Set environment variables at runtime—no rebuilds needed.

---

Build once. Deploy everywhere. **Runtime environment variables done right.**
