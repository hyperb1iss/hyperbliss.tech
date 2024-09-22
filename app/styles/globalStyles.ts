// app/styles/globalStyles.ts

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --font-heading: 'Orbitron', sans-serif;
    --font-body: 'Rajdhani', sans-serif;
    --font-mono: 'Share Tech Mono', monospace;
    --color-background: #0a0a14;
    --color-text: #e0e0e0;
    --color-primary: #ff007f;
    --color-secondary: #7f00ff;
    --color-accent: #00fff0;
    --color-muted: #a0a0a0;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    font-family: var(--font-body);
    font-size: 1.6rem;
    color: var(--color-text);
    background-color: var(--color-background);
    background-image: url('/images/cyberpunk-bg.jpg'); /* Add a cyberpunk background image */
    background-size: cover;
    background-attachment: fixed;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 4.8rem;
  }

  h2 {
    font-size: 3.6rem;
  }

  h3 {
    font-size: 2.4rem;
  }

  a {
    color: var(--color-accent);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--color-secondary);
  }

  p {
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  /* Glowing Text */
  .glow {
    color: var(--color-primary);
    text-shadow: 0 0 5px var(--color-primary), 0 0 10px var(--color-primary);
  }

  /* Responsive Typography */
  @media (max-width: 768px) {
    h1 {
      font-size: 3.6rem;
    }

    h2 {
      font-size: 2.8rem;
    }

    h3 {
      font-size: 2rem;
    }

    body {
      font-size: 1.4rem;
    }
  }
`;
