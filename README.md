# 🌟 Hyperbliss.tech 🌟

Welcome to **Hyperbliss.tech**, the personal website of [Stefanie Jane](https://hyperbliss.tech)—developer, designer, and tech enthusiast. This website is built with **Next.js 13+** and **TypeScript**, leveraging the new App Router for enhanced performance and developer experience. It's designed to showcase projects, blog posts, and personal brand in a modern, feminine, and high-tech style.

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+](https://nextjs.org/) with TypeScript and App Router
- **Styling**: [Styled Components](https://styled-components.com/) for dynamic, component-scoped styles
- **Content Management**: Markdown files with frontmatter for blog posts and project descriptions
- **Markdown Processing**: [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter parsing, [react-markdown](https://github.com/remarkjs/react-markdown) for rendering
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions and animations
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) for social media and UI icons
- **SEO**: [Next SEO](https://github.com/garmeeh/next-seo) for search engine optimization
- **Analytics**: [Google Analytics](https://analytics.google.com/) integration using [nextjs-google-analytics](https://github.com/MauricioRobayo/nextjs-google-analytics)
- **Deployment**: [Netlify](https://www.netlify.com/) for continuous deployment

## 🎨 Design Features

- Modern, feminine, and high-tech aesthetic
- Prominent purple color scheme with complementary neutral tones
- Typography featuring Proxima Nova and other modern, tech-inspired fonts
- Responsive design for optimal viewing on all devices
- Interactive elements and smooth animations for engaging user experience

## 🚀 Key Features

- **Home Page**: Engaging introduction with animated elements
- **About Page**: Personal bio and professional background
- **Blog**: Articles on tech, design, and development
- **Projects**: Showcase of personal and professional projects
- **Contact**: Social media links for easy connection

## 📁 Project Structure

The project follows a clean, modular structure:

```
/
├── app/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── about/
│   ├── blog/
│   ├── projects/
│   └── page.tsx
├── public/
├── src/
│   ├── posts/
│   └── projects/
└── package.json
```

- `app/`: Contains the Next.js application code, components, and pages
- `src/posts/`: Markdown files for blog posts
- `src/projects/`: Markdown files for project descriptions
- `public/`: Static assets like images and fonts

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hyperb1iss/hyperbliss.tech.git
   cd hyperbliss.tech
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📝 Content Management

### Adding New Content

1. **Blog Posts**:

   - Create a new Markdown file in `src/posts/`
   - Add frontmatter at the top of the file:

     ```markdown
     ---
     title: "Your Blog Post Title"
     date: "YYYY-MM-DD"
     excerpt: "A brief description of your post"
     ---

     Your blog post content here...
     ```

2. **Projects**:

   - Create a new Markdown file in `src/projects/`
   - Add frontmatter at the top of the file:

     ```markdown
     ---
     title: "Your Project Title"
     description: "A brief description of your project"
     github: "https://github.com/yourusername/project-repo"
     ---

     Your project details here...
     ```

### Generating Content

After adding or modifying content in `src/posts/` or `src/projects/`, run the build command to generate the static pages:

```bash
npm run build
# or
yarn build
```

This process will create static pages for your new content, making it available on the website.

## 🔧 Customization

- Modify `app/styles/globals.css` for global styles and CSS variables
- Update components in `app/components/` for reusable UI elements
- Adjust SEO settings in `app/lib/next-seo.config.ts`

## 🌐 Deployment

The site is set up for continuous deployment with Netlify. Push to the `main` branch to trigger a new deployment. Ensure you run `npm run build` locally and commit the changes before pushing to ensure all new content is included in the deployment.
