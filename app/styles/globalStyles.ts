// src/styles/globalStyles.ts

import { createGlobalStyle } from 'styled-components';

/**
 * GlobalStyle defines global CSS styles for the application.
 */
export const GlobalStyle = createGlobalStyle`
  /* Reset and global styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Proxima Nova', sans-serif;
    background-color: #0e0b16;
    color: #e7dfdd;
    line-height: 1.6;
    overflow-x: hidden;
  }

  a {
    color: #e7dfdd;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    color: #a239ca;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #4717f6;
    border-radius: 4px;
  }
`;
