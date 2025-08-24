# 🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹

<div align="center">

[![NETLIFY](https://img.shields.io/badge/NETLIFY-DEPLOYED-8a2be2?style=for-the-badge&logo=netlify&logoColor=white)](https://app.netlify.com/sites/hyperb1iss/deploys)
[![TYPESCRIPT](https://img.shields.io/badge/TYPESCRIPT-5.8-a259ff?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NEXT.JS](https://img.shields.io/badge/NEXT.JS-15.2-b967ff?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![JEST](https://img.shields.io/badge/JEST-29.7-d11aff?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![STYLED](https://img.shields.io/badge/STYLED-COMPONENTS-ff57e8?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![REACT](https://img.shields.io/badge/REACT-19.0-ff75d8?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![LICENSE](https://img.shields.io/badge/LICENSE-CC_BY--NC--SA-00fff0?style=for-the-badge)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

</div>

Welcome to the nexus of [hyperbliss.tech](https://hyperbliss.tech), a cybernetic
sanctuary crafted by Stefanie Jane— resident software sorceress and pixel
enchantress. 🔮👩‍💻⚡

## 🌌 Vision

In the vast expanse of the internet, hyperbliss.tech stands as a beacon—a fusion
of technology and creativity. This digital portfolio serves as a testament to
the art of web development, a gallery of innovative projects, and a hub for
nerds, ADHD catgirls, and magical creatures.

Here, you'll find:

- 🕸️ Intricately crafted code, weaving responsive designs that adapt to any
  device
- 📜 Insightful blog posts, exploring the ever-evolving digital landscape
- 🔧 Innovative projects that push the boundaries of web technology
- 🌟 Interfaces that come alive with smooth, ethereal animations
- 🔍 Optimized pathways ensuring discoverability across the web
- 📊 Analytics to understand and enhance user experiences

Stefanie Jane, the architect of this digital sanctum, is a multi-faceted
technology witch. Her expertise spans the entire software stack, from crafting
captivating user interfaces with front-end sorcery, to conjuring scalable
infrastructure, and the arcane arts of embedded systems and operating systems.
With an alchemical blend of technical prowess and artistic vision, she creates
holistic software experiences that are as beautiful as they are powerful.

## ✨ Features

- 🌙 Sleek, modern design with a touch of mystique
- 📱 Responsive layout that morphs seamlessly across all devices
- 🔮 Interactive elements that respond to user interaction
- 📜 A blog that serves as a conduit for insights and knowledge
- 🖼️ A showcase of various projects demonstrating expertise
- 🔭 SEO optimization to enhance visibility and reach
- 🕯️ Google Analytics integration for data-driven improvements
- 🌠 CyberScape: An immersive, interactive background animation

## 🛠️ Technology Stack

- **Framework**: Next.js 15.2 with TypeScript 5.8
- **Frontend**: React 19.0
- **Styling**: Styled Components 6.1
- **Routing**: Next.js App Router
- **Content Management**: Markdown files with gray-matter and react-markdown
  10.1
- **Animations**: Framer Motion 12.5
- **Icons**: React Icons 5.5
- **SEO**: Next SEO
- **Analytics**: Google Analytics (via nextjs-google-analytics)
- **Interactive Background**: CyberScape (custom animation)
- **Testing**: Jest 29.7 with Testing Library React 16.2
- **Linting & Formatting**: ESLint 9.22 and Prettier 3.5

## 🏗️ Project Structure

```
.
├── app/
│   ├── (transition)/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── projects/
│   │   └── resume/
│   ├── api/
│   │   └── rss/
│   ├── components/
│   ├── cyberscape/
│   │   ├── utils/
│   │   ├── handlers/
│   │   ├── shapes/
│   │   ├── effects/
│   │   └── particles/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── layout.tsx
├── public/
│   └── images/
├── src/
│   ├── posts/
│   ├── projects/
│   └── resume.md
├── tests/
│   ├── mocks/
│   └── seo/
├── scripts/
└── various config files (.eslint.config.mjs, next.config.mjs, etc.)
```

Key directories:

- `app/`: Next.js 13+ app directory containing the main application code
- `app/cyberscape/`: The interactive background animation system
- `app/components/`: Reusable React components
- `app/lib/`: Utility functions and configurations
- `src/`: Content files (blog posts, projects, resume)
- `tests/`: Test files and mocks
- `public/`: Static assets
- `scripts/`: Utility scripts

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/hyperb1iss/hyperbliss.tech.git
   cd hyperbliss.tech
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see
   the result.

## 🧪 Testing and Linting

### Testing

The project uses Jest and React Testing Library for testing. Tests are located
in the `tests/` directory.

Available test commands:

- `npm test` or `yarn test`: Run all tests
- `npm run test:watch` or `yarn test:watch`: Run tests in watch mode
- `npm run test:seo` or `yarn test:seo`: Run SEO-specific tests
- `npm run test:seo:watch` or `yarn test:seo:watch`: Run SEO tests in watch mode

### Linting

ESLint is configured for code quality and consistency. The project uses the
Next.js ESLint configuration as a base with TypeScript support.

Available lint commands:

- `npm run lint` or `yarn lint`: Lint the app and tests directories
- `npm run lint:fix` or `yarn lint:fix`: Automatically fix linting issues
- `npm run format` or `yarn format`: Format code with Prettier
- `npm run format:check` or `yarn format:check`: Check formatting with Prettier

### Test Setup

The project uses the following testing libraries and configurations:

- Jest with SWC for fast TypeScript transformation
- React Testing Library for component testing
- Jest environment jsdom for DOM simulation
- Custom test setup with path aliases for simplified imports

Test files should be placed in the `tests/` directory with the `.test.ts` or
`.test.tsx` extension.

## 🌠 CyberScape: Immersive Interactive Background

CyberScape is a custom-built, interactive background animation that brings the
cyberpunk aesthetic of hyperbliss.tech to life. It creates a dynamic, responsive
environment that reacts to user interactions and adds depth to the overall user
experience.

### Key Features of CyberScape

- **Interactive Particles**: A field of glowing particles that respond to cursor
  movements.
- **Vector Shapes**: 3D wireframe shapes (cubes, pyramids, stars) floating in
  space.
- **Dynamic Connections**: Lines connecting nearby particles to create a network
  effect.
- **Glitch Effects**: Occasional glitch animations for an authentic cyberpunk
  feel.
- **Responsive Design**: Adapts to different screen sizes and device
  capabilities.

### How CyberScape Works

1. **Initialization**: The `initializeCyberScape` function sets up the canvas
   and initializes particles and shapes.

2. **Animation Loop**: A continuous loop updates and renders all elements:
   - Particles and shapes move and rotate.
   - Connections between particles are calculated and drawn.
   - Glitch effects are randomly applied.

3. **User Interaction**: The animation responds to mouse movements when the
   cursor is over the header area.

4. **Performance Optimization**: Various techniques are used to ensure smooth
   performance:
   - Throttled event listeners.
   - Efficient rendering techniques.
   - Adjusting the number of elements based on screen size.

5. **Visual Effects**:
   - Dynamic color transitions.
   - Glow effects on particles and shapes.
   - Chromatic aberration and CRT effects during glitch animations.

### CyberScape Components

- `CyberScape.ts`: Main controller for the animation.
- `Particle.ts`: Defines the behavior of individual particles.
- `VectorShape.ts`: Manages the 3D vector shapes.
- `CyberScapeUtils.ts`: Utility functions for colors, projections, and more.
- `glitchEffects.ts`: Implements various glitch and distortion effects.

CyberScape exemplifies the fusion of art and technology, creating an engaging
and visually stunning backdrop for the hyperbliss.tech experience.

## 🎨 Styling

The project uses Styled Components for styling, with global styles and variables
defined in `src/app/styles/globals.css`. The color scheme focuses on purple hues
with complementary colors:

- Primary: `#a259ff`
- Secondary: `#ff75d8`
- Accent: `#00fff0`
- Background: `#0a0a14`
- Text: `#e0e0e0`

## 📝 Content Management

Blog posts and project descriptions are managed through Markdown files located
in the `src/posts/` and `src/projects/` directories respectively. Each Markdown
file includes frontmatter for metadata.

## 🔍 SEO and Analytics

SEO is managed through Next SEO, with configurations in
`src/app/lib/next-seo.config.ts`. Google Analytics is integrated using
`nextjs-google-analytics`.

## 🌟 Key Components

### Header (`Header.tsx`)

Main navigation component with animated logo and responsive design.

### Footer (`Footer.tsx`)

Displays social media links and copyright information.

### PageWrapper (`PageWrapper.tsx`)

Handles page transitions and layout consistency.

### BlogList (`BlogList.tsx`) & BlogPost (`BlogPost.tsx`)

Render blog content with a grid layout and individual post display.

### ProjectList (`ProjectList.tsx`) & ProjectDetail (`ProjectDetail.tsx`)

Display project information in a grid and detailed view respectively.

### MainContent (`MainContent.tsx`)

Manages main content area and page transitions.

### AboutPageContent (`AboutPageContent.tsx`)

Renders the About page with profile information.

### ResumePageContent (`ResumePageContent.tsx`)

Displays resume information from Markdown content.

## 🚀 Deployment

The site is configured for deployment on Netlify with a standalone output mode:

1. Connect your GitHub repository to Netlify.
2. Set the build command to `npm run build` or `yarn build`.
3. Set the publish directory to `out`.
4. Configure environment variables as needed.

Netlify will automatically deploy the site on push to the main branch.

## 🧙‍♀️ Join The Coven

Contributions, issues, and feature requests are welcome! Check out the
[issues page](https://github.com/hyperb1iss/hyperbliss.tech/issues) to join the
quest.

## 📜 License

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:

- **Share** — Copy and redistribute the material in any medium or format
- **Adapt** — Remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the
  license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must
  distribute your contributions under the same license as the original.

For the full text of this license, see the
[complete license](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).

---

<div align="center">

Created by [Stefanie Jane 🌠](https://hyperbliss.tech)

</div>
