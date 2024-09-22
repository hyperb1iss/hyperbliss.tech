# 🌟 Hyperbliss.tech 🌟

Welcome to **Hyperbliss.tech**, the personal website of [Stefanie Kondik](https://hyperbliss.tech)—developer, designer, and tech enthusiast. This website is built with **Next.js** and **TypeScript** for scalability and performance. It’s designed to showcase my projects, blog posts, and personal brand in a modern, high-tech, and creative way.

![Hero Section](public/images/hero-preview.png)

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with TypeScript
- **Styling**: [Styled Components](https://styled-components.com/) for dynamic, component-scoped styles
- **Markdown Parsing**: [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter parsing
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions and animations
- **SEO & Analytics**: [Next SEO](https://github.com/garmeeh/next-seo) and [Google Analytics](https://analytics.google.com/)
- **Deployment**: [Netlify](https://www.netlify.com/) for continuous deployment

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (preferably the latest LTS version).
- **npm or Yarn**: Use npm (default) or install Yarn for package management.

### Clone the Repository

```bash
git clone https://github.com/hyperb1iss/hyperbliss.git
cd hyperbliss
```

### Install Dependencies

```bash
npm install
# or if using yarn
yarn install
```

### Run Development Server

To start the development server locally:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:3000` to see the site in action.

---

## 🌟 Project Structure

The project is organized with a clean, modular structure to ensure maintainability and scalability.

```bash
hyperbliss/
├── public/               # Static assets (images, favicons, etc.)
├── app/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js pages (index.tsx, about.tsx, blog/[slug].tsx, etc.)
│   ├── posts/            # Markdown files for blog posts
│   ├── projects/         # Markdown files for project descriptions
│   ├── styles/           # Global and component-specific styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and helpers
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── tsconfig.json         # TypeScript configuration
├── next-env.d.ts         # Next.js environment types
├── next.config.js        # Next.js configuration
└── README.md             # You're here!
```

---

## 📖 Markdown Content

### Adding Blog Posts

All blog posts are written in Markdown and located in the `src/posts/` directory. Each Markdown file contains **frontmatter** metadata, which allows you to specify details like the title, date, and excerpt.

**Example blog post file**:

```markdown
---
title: "Exploring Modern Web Development"
date: "2024-01-01"
excerpt: "Why Next.js and React are the future of modern web development."
---

# Introduction

In this post, we explore why modern frameworks like Next.js are so powerful...
```

### Adding Projects

Project descriptions are also written in Markdown and stored in the `src/projects/` directory. Use frontmatter to specify project-specific details like the title, description, and GitHub repository link.

**Example project file**:

```markdown
---
title: "HyperAwesome Project"
description: "A groundbreaking project revolutionizing the way we approach software development."
github: "https://github.com/hyperb1iss/hyperawesome-project"
---

# Project Overview

The **HyperAwesome Project** leverages modern web technologies to provide...
```

---

## 🔧 Scripts

### Start Development Server

Run the local development server:

```bash
npm run dev
# or
yarn dev
```

### Build for Production

Generate a static build for production:

```bash
npm run build
# or
yarn build
```

### Serve Production Build Locally

Serve the production build locally to test it:

```bash
npm run start
# or
yarn start
```

### Lint the Code

Run ESLint to ensure code quality and consistency:

```bash
npm run lint
# or
yarn lint
```

---

## 🖼️ Adding Images

All images used for the site should be placed in the `public/images/` directory. You can reference these images in your Markdown files or components using the following pattern:

```jsx
<img src="/images/my-image.png" alt="A description of the image" />
```

### Image Optimization

Next.js automatically optimizes images served from the `public/` folder. For additional optimization, ensure your images are compressed and appropriately sized.

---

## 📊 Analytics Setup

The site uses **Google Analytics** to track user behavior. The tracking ID is stored in the environment variables.

### Setting Up Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/) and create a new property for **hyperbliss.tech**.
2. Get your tracking ID (e.g., `UA-XXXXXXXXX-X` or `G-XXXXXXXXXX`).
3. Add the tracking ID to your `.env.local` file as follows:

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

4. The site automatically tracks page views using the `nextjs-google-analytics` package.

---

## 🌍 SEO Configuration

The project uses **Next SEO** for search engine optimization. SEO configuration for the site is centralized in `src/next-seo.config.ts`. You can customize the site's metadata and social sharing information there.

```typescript
const SEO = {
  title: "Hyperbliss",
  description:
    "The personal website of Stefanie Kondik—developer, designer, and tech enthusiast.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hyperbliss.tech/",
    site_name: "Hyperbliss",
  },
  twitter: {
    handle: "@hyperb1iss",
    site: "@hyperb1iss",
    cardType: "summary_large_image",
  },
};

export default SEO;
```

---

## 📦 Deployment

The site is deployed using **Netlify**, which provides seamless continuous deployment from GitHub. Each time you push to the `main` branch, Netlify will automatically build and deploy the site.

### Steps to Deploy

1. **Push to GitHub**: Make sure your latest code is committed and pushed to the `main` branch:

   ```bash
   git add .
   git commit -m "Deploy latest changes"
   git push origin main
   ```

2. **Netlify Deployment**: Netlify will detect the changes and automatically trigger a deployment. The build settings are:

   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`

---

## 🔧 Maintenance

### Keeping Dependencies Updated

To ensure the site stays up to date with the latest improvements, regularly update your dependencies. You can update packages with:

```bash
npm update
# or
yarn upgrade
```

### Regular Backups

Ensure your GitHub repository is up to date, as this serves as the primary backup for all your site's content and code. Use feature branches to test new features or changes before merging into the `main` branch.

---

## 📚 Additional Resources

- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Styled Components**: [https://styled-components.com/](https://styled-components.com/)
- **Framer Motion**: [https://www.framer.com/motion/](https://www.framer.com/motion/)
- **Markdown Guide**: [https://www.markdownguide.org/](https://www.markdownguide.org/)
- **Google Analytics**: [https://analytics.google.com/](https://analytics.google.com/)
