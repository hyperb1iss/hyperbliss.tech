# 🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹

Welcome to the nexus of [hyperbliss.tech](https://hyperbliss.tech), a cybernetic sanctuary crafted by Stefanie Jane—code sorceress, pixel enchantress, and digital oracle. 🔮👩‍💻⚡

## 🌌 Vision

In the vast expanse of the internet, hyperbliss.tech stands as a beacon—a fusion of technology and creativity. This digital portfolio serves as a testament to the art of web development, a gallery of innovative projects, and a hub for nerds, ADHD catgirls, and magical creatures.

Here, you'll find:

- 🕸️ Intricately crafted code, weaving responsive designs that adapt to any device
- 📜 Insightful blog posts, exploring the ever-evolving digital landscape
- 🔧 Innovative projects that push the boundaries of web technology
- 🌟 Interfaces that come alive with smooth, ethereal animations
- 🔍 Optimized pathways ensuring discoverability across the web
- 📊 Analytics to understand and enhance user experiences

Stefanie Jane, the architect of this digital sanctum, is a multi-faceted technology wizard. Her expertise spans the entire software stack, from crafting captivating user interfaces with front-end sorcery, to conjuring scalable infrastructure, and the arcane arts of embedded systems and operating systems. With an alchemical blend of technical prowess and artistic vision, she creates holistic software experiences that are as beautiful as they are powerful.

## ✨ Features

- 🌙 Sleek, modern design with a touch of digital mystique
- 📱 Responsive layout that morphs seamlessly across all devices
- 🔮 Interactive elements that respond to user interaction
- 📜 A blog that serves as a conduit for insights and knowledge
- 🖼️ A showcase of various projects demonstrating expertise
- 🔭 SEO optimization to enhance visibility and reach
- 🕯️ Google Analytics integration for data-driven improvements
- 🌠 CyberScape: An immersive, interactive background animation

## 🛠️ Technology Stack

- **Framework**: Next.js 13+ with TypeScript
- **Styling**: Styled Components
- **Routing**: Next.js App Router
- **Content Management**: Markdown files with gray-matter and react-markdown
- **Animations**: Framer Motion
- **Icons**: React Icons
- **SEO**: Next SEO
- **Analytics**: Google Analytics (via nextjs-google-analytics)
- **Interactive Background**: CyberScape (custom animation)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (transition)/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── projects/
│   │   └── resume/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── layout.tsx
├── posts/
├── projects/
└── cyberscape/
    ├── CyberScape.ts
    ├── CyberScapeUtils.ts
    ├── Particle.ts
    ├── VectorShape.ts
    └── glitchEffects.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🌠 CyberScape: Immersive Interactive Background

CyberScape is a custom-built, interactive background animation that brings the cyberpunk aesthetic of hyperbliss.tech to life. It creates a dynamic, responsive environment that reacts to user interactions and adds depth to the overall user experience.

### Key Features of CyberScape

- **Interactive Particles**: A field of glowing particles that respond to cursor movements.
- **Vector Shapes**: 3D wireframe shapes (cubes, pyramids, stars) floating in space.
- **Dynamic Connections**: Lines connecting nearby particles to create a network effect.
- **Glitch Effects**: Occasional glitch animations for an authentic cyberpunk feel.
- **Responsive Design**: Adapts to different screen sizes and device capabilities.

### How CyberScape Works

1. **Initialization**: The `initializeCyberScape` function sets up the canvas and initializes particles and shapes.

2. **Animation Loop**: A continuous loop updates and renders all elements:

   - Particles and shapes move and rotate.
   - Connections between particles are calculated and drawn.
   - Glitch effects are randomly applied.

3. **User Interaction**: The animation responds to mouse movements when the cursor is over the header area.

4. **Performance Optimization**: Various techniques are used to ensure smooth performance:

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

CyberScape exemplifies the fusion of art and technology, creating an engaging and visually stunning backdrop for the hyperbliss.tech experience.

## 🎨 Styling

The project uses Styled Components for styling, with global styles and variables defined in `src/app/styles/globals.css`. The color scheme focuses on purple hues with complementary colors:

- Primary: `#a259ff`
- Secondary: `#ff75d8`
- Accent: `#00fff0`
- Background: `#0a0a14`
- Text: `#e0e0e0`

## 📝 Content Management

Blog posts and project descriptions are managed through Markdown files located in the `src/posts/` and `src/projects/` directories respectively. Each Markdown file includes frontmatter for metadata.

## 🔍 SEO and Analytics

SEO is managed through Next SEO, with configurations in `src/app/lib/next-seo.config.ts`. Google Analytics is integrated using `nextjs-google-analytics`.

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

The site is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify.
2. Set the build command to `npm run build` or `yarn build`.
3. Set the publish directory to `out`.
4. Configure environment variables as needed.

Netlify will automatically deploy the site on push to the main branch.

## 🧙‍♀️ Join The Coven

Contributions, issues, and feature requests are welcome! Check out the [issues page](https://github.com/hyperb1iss/hyperbliss.tech/issues) to join the quest.

## 📜 License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:

- **Share** — Copy and redistribute the material in any medium or format
- **Adapt** — Remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

For the full text of this license, see the [complete license](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).

---

<p align="center">
  <img src="https://hyperbliss.tech/images/logo.png" alt="hyperbliss.tech logo" width="200">
  <br>
  <em>Woven with 💜 and ✨ by Stefanie Jane</em>
</p>
