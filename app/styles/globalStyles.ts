import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@300;400;500;700&family=Share+Tech+Mono&display=swap');

  :root {
    --font-heading: 'Orbitron', sans-serif;
    --font-body: 'Rajdhani', sans-serif;
    --font-mono: 'Share Tech Mono', monospace;
    --color-background: #0a0a14;
    --color-text: #f0f0f0;
    --color-primary: #ff00ff;
    --color-secondary: #00ffff;
    --color-accent: #39ff14;
    --color-muted: #a0a0a0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%; // This makes 1rem = 10px
  }

  body {
    font-family: var(--font-body);
    font-size: 1.8rem;
    line-height: 1.6;
    font-weight: 300;
    color: var(--color-text);
    background-color: var(--color-background);
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 100% 0%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
    background-attachment: fixed;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: 1.2;
    margin-bottom: 2rem;
    color: var(--color-primary);
    text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h1 { font-size: 5.2rem; font-weight: 700; }
  h2 { font-size: 4.0rem; font-weight: 500; }
  h3 { font-size: 3.2rem; font-weight: 500; }

  a {
    color: var(--color-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;
    &:hover {
      color: var(--color-accent);
      text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
    }
  }

  p {
    margin-bottom: 1.6rem;
  }

  code, pre {
    font-family: var(--font-mono);
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 0.2em 0.4em;
  }

  /* Improved scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
    &:hover {
      background: var(--color-secondary);
    }
  }

  /* Glowing text effect */
  .glow {
    text-shadow: 0 0 10px currentColor;
  }

  /* Neon border effect */
  .neon-border {
    border: 2px solid var(--color-secondary);
    box-shadow: 0 0 10px var(--color-secondary);
  }
`;