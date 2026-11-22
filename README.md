# 🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ⎊ ⨳ ✵ ⊹

<div align="center">

[![Netlify](https://img.shields.io/badge/NETLIFY-DEPLOYED-8a2be2?style=for-the-badge&logo=netlify&logoColor=white)](https://app.netlify.com/sites/hyperb1iss/deploys)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-STRICT-a259ff?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/NEXT.JS-APP_ROUTER-b967ff?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/REACT-19-ff75d8?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Panda CSS](https://img.shields.io/badge/PANDA-CSS-ff57e8?style=for-the-badge&logo=css3&logoColor=white)](https://panda-css.com/)
[![License](https://img.shields.io/badge/LICENSE-CC_BY--NC--SA-00fff0?style=for-the-badge)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

</div>

Welcome to the source code of [hyperbliss.tech](https://hyperbliss.tech), the
home of Hyperbliss Technologies. 🔮

This is home base: the products, the essays, the lab, and an interactive
particle system called CyberScape that turns the header into a living neon
field. A place for nerds, ADHD catgirls, and magical creatures.

## 🌌 What's Inside

- 🌠 **CyberScape**: A custom Canvas2D particle system with 3D projections,
  wireframe shapes, glitch effects, and chromatic aberration, all reacting to
  your cursor
- 📜 **Writing**: Technical deep-dives on creative coding, terminal design, AI
  agent orchestration, and the demoscene
- 🔧 **Products**: Hypercolor, Sibyl, unifly, and the open source around them,
  with live versions and stars from GitHub
- 🧪 **Lab**: Interactive experiments
- 🪄 **Console**: A pull-down terminal on every page, with a real shell over the
  site's content and an LED wall to write on
- 🎨 **SilkCircuit aesthetic**: Purple gradients, neon cyan accents, and plasma
  pink everywhere

## 🛠️ Stack

| Layer     | Tools                                                      |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js (App Router), React, TypeScript                    |
| Styling   | Panda CSS (zero-runtime CSS-in-JS)                         |
| Animation | Framer Motion, CyberScape (custom particle system)         |
| Content   | Markdown + gray-matter, read from `content/` at build time |
| Testing   | Vitest + Testing Library                                   |
| Linting   | Biome + Prettier (markdown/YAML only)                      |
| Deploy    | Netlify                                                    |

## ⚡ Quick Start

```bash
git clone https://github.com/hyperb1iss/hyperbliss.tech.git
cd hyperbliss.tech
pnpm install
pnpm dev
```

Open [http://localhost:1337](http://localhost:1337) and watch the particles
dance.

## 🧪 Scripts

| Command          | What it does                             |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Start dev server                         |
| `pnpm build`     | Production build (`panda && next build`) |
| `pnpm test`      | Run tests                                |
| `pnpm lint`      | Biome check + Prettier                   |
| `pnpm typecheck` | TypeScript type check                    |
| `pnpm analyze`   | Bundle size analysis                     |

## 🏗️ Project Structure

```
app/
  (transition)/       Routes (home, about, blog, projects, lab, archive, resume)
  components/         React components
  cyberscape/         The particle system that makes the header glow
  lib/                Content loading, metadata, utilities
content/
  posts/              Blog posts (markdown)
  projects/           Project pages (markdown)
  lab/                Lab experiments (markdown)
  pages/              Page copy (JSON)
  resume/             Resume (markdown)
tests/                Vitest tests
styled-system/        Panda CSS generated styles
```

## 🌠 CyberScape

The header isn't just a gradient. It's a custom particle system with roots in
the 8-bit demoscene: gl-matrix for 3D math, Canvas2D for rendering, particles
that drift and connect, wireframe shapes that rotate in space, glitch effects
that fire at random, and chromatic aberration for that authentic CRT feel. The
whole thing adapts to screen size and device capability, so it looks good
everywhere without melting your phone.

## 📝 Content

Blog posts and project pages are markdown files in `content/` with YAML
frontmatter. Page configs (home, about) are JSON. Everything is read from disk
at build time with gray-matter and rendered with react-markdown + remark-gfm. No
CMS, no database, no cloud dependency. Just files.

## 🎨 Color Palette

```
Cosmic Purple   #a259ff    Primary brand
Neon Pink       #ff75d8    Accent energy
Digital Cyan    #00fff0    Tech highlight
Void Black      #0a0a14    Background depth
```

## 📜 License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-nc-sa/4.0/)

---

<div align="center">

Created by [Stefanie Jane 🌠](https://hyperbliss.tech)

If you find this interesting,
[check out my other projects](https://github.com/hyperb1iss) or
[sponsor my work](https://github.com/sponsors/hyperb1iss).

</div>
