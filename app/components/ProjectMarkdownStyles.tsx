// app/components/ProjectMarkdownStyles.tsx
import styled from 'styled-components'

// Project-specific styles with cyan/teal dominance contrasting with blog's purple/magenta
// Headings
export const ProjectH1 = styled.h1`
  font-size: clamp(2.5rem, 2.5vw, 4rem);
  background: linear-gradient(
    135deg,
    #00fff0 0%,
    #00e5ff 25%,
    #00acc1 50%,
    #26c6da 75%,
    #00fff0 100%
  );
  background-size: 200% 200%;
  animation: shimmerCyan 8s ease infinite;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 25px rgba(0, 255, 240, 0.4))
          drop-shadow(0 0 15px rgba(0, 229, 255, 0.3));
  text-align: left;
  font-weight: 700;
  line-height: 1.2;
  
  @keyframes shimmerCyan {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

export const ProjectH2 = styled.h2`
  font-size: clamp(2rem, 2vw, 3.5rem);
  background: linear-gradient(
    90deg,
    #00acc1 0%,
    #00fff0 35%,
    #26c6da 70%,
    #00e5ff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 0 20px rgba(0, 172, 193, 0.3));
  text-align: left;
  font-weight: 600;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #00fff0, transparent);
  }
`

export const ProjectH3 = styled.h3`
  font-size: clamp(1.75rem, 1.5vw, 3rem);
  color: #00e5ff;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.4),
               0 0 8px rgba(0, 255, 240, 0.3);
  text-align: left;
  font-weight: 600;
  position: relative;
  padding-left: 1.2rem;
  
  &::before {
    content: '◆';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #26c6da;
    font-size: 1.2em;
    text-shadow: 0 0 10px rgba(38, 198, 218, 0.6);
  }
`

// Paragraph
export const ProjectParagraph = styled.p`
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  line-height: 1.7;
  color: rgba(224, 224, 224, 0.9);
  margin-bottom: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  
  strong {
    color: #00fff0;
    font-weight: 600;
    text-shadow: 0 0 8px rgba(0, 255, 240, 0.3);
  }
  
  em {
    color: #26c6da;
    font-style: italic;
    text-shadow: 0 0 5px rgba(38, 198, 218, 0.2);
  }
`

// Links
export const ProjectLink = styled.a`
  color: #00acc1;
  text-decoration: none;
  position: relative;
  transition: all 0.3s var(--ease-silk);
  font-weight: 500;
  text-shadow: 0 0 8px rgba(0, 172, 193, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      #00fff0,
      #00e5ff,
      #26c6da
    );
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s var(--ease-silk);
  }

  &:hover {
    color: #00fff0;
    text-shadow: 0 0 15px rgba(0, 255, 240, 0.6),
                 0 0 8px rgba(0, 229, 255, 0.4);
    
    &::after {
      transform: scaleX(1);
      transform-origin: left;
      box-shadow: 0 0 10px rgba(0, 255, 240, 0.5);
    }
  }
`

// Blockquote
export const ProjectBlockquote = styled.blockquote`
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  border-left: 3px solid transparent;
  padding: 1.5rem 1.5rem 1.5rem 2.5rem;
  color: #26c6da;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.12) 0%,
    rgba(0, 229, 255, 0.08) 25%,
    rgba(30, 25, 45, 0.6) 50%,
    rgba(0, 172, 193, 0.06) 75%,
    rgba(38, 198, 218, 0.08) 100%
  );
  backdrop-filter: blur(15px) saturate(1.2);
  margin: 2rem 0;
  font-style: italic;
  border-radius: var(--radius-lg);
  position: relative;
  box-shadow: 
    0 0 30px rgba(0, 229, 255, 0.2),
    0 0 60px rgba(0, 255, 240, 0.1),
    inset 0 0 30px rgba(0, 172, 193, 0.05);
  text-shadow: 0 0 10px rgba(38, 198, 218, 0.3);
  
  &::before {
    content: '❝';
    position: absolute;
    left: 0.8rem;
    top: 0.5rem;
    font-size: 2.5rem;
    color: #00fff0;
    text-shadow: 0 0 20px rgba(0, 255, 240, 0.6);
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      180deg,
      #00fff0,
      #00e5ff,
      #26c6da,
      #00fff0
    );
    border-radius: 2px;
    animation: pulseCyan 3s ease infinite;
  }
  
  @keyframes pulseCyan {
    0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 240, 0.5); }
    50% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.8); }
  }
`

// Horizontal Rule
export const ProjectHr = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    #00acc1 20%,
    #00fff0 50%,
    #00acc1 80%,
    transparent
  );
  margin: 3rem 0;
  position: relative;
  
  &::after {
    content: '◈';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--silk-void-black);
    color: #00fff0;
    padding: 0 1rem;
    font-size: 1.2rem;
    text-shadow: 0 0 10px rgba(0, 255, 240, 0.6);
  }
`

// Inline Code
export const ProjectInlineCode = styled.code`
  font-size: clamp(1.4rem, 1vw, 1.8rem);
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.2),
    rgba(0, 255, 240, 0.1),
    rgba(30, 25, 45, 0.8)
  );
  color: #00fff0;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  border: 1px solid rgba(0, 255, 240, 0.3);
  text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
  transition: all 0.2s var(--ease-silk);
  
  &:hover {
    border-color: #00e5ff;
    background: linear-gradient(
      135deg,
      rgba(0, 172, 193, 0.25),
      rgba(0, 229, 255, 0.15),
      rgba(30, 25, 45, 0.8)
    );
    color: #26c6da;
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba(0, 229, 255, 0.3);
  }
`

// Lists
export const ProjectUl = styled.ul`
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  list-style-type: none;
  padding-left: 2rem;
  margin-bottom: 1.5rem;
  
  li {
    position: relative;
    padding-left: 1.8rem;
    
    &::before {
      content: '◉';
      position: absolute;
      left: 0;
      color: #00e5ff;
      font-weight: bold;
      font-size: 1.2em;
      text-shadow: 0 0 12px rgba(0, 229, 255, 0.6),
                   0 0 6px rgba(0, 255, 240, 0.4);
      animation: pulseDot 2s ease infinite;
    }
    
    @keyframes pulseDot {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
  }
`

export const ProjectOl = styled.ol`
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  list-style-type: none;
  padding-left: 2rem;
  margin-bottom: 1.5rem;
  counter-reset: list-counter;
  
  li {
    position: relative;
    padding-left: 2.5rem;
    counter-increment: list-counter;
    
    &::before {
      content: counter(list-counter);
      position: absolute;
      left: 0;
      top: 0.1em;
      width: 1.8rem;
      height: 1.8rem;
      background: linear-gradient(135deg, #00fff0, #00acc1);
      color: var(--silk-void-black);
      font-weight: bold;
      font-family: var(--font-mono);
      font-size: 0.8em;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(0, 255, 240, 0.5),
                  inset 0 0 10px rgba(0, 172, 193, 0.3);
    }
  }
`

export const ProjectLi = styled.li`
  margin-bottom: 0.8rem;
  line-height: 1.7;
  color: rgba(224, 224, 224, 0.9);
`

// Image
export const ProjectImage = styled.img`
  max-width: 100%;
  border-radius: var(--radius-lg);
  margin: 1.5rem 0;
  border: 2px solid rgba(0, 255, 240, 0.2);
  box-shadow: 0 0 30px rgba(0, 255, 240, 0.2),
              0 0 60px rgba(0, 229, 255, 0.1);
  transition: all 0.3s var(--ease-silk);
  
  &:hover {
    border-color: rgba(0, 255, 240, 0.4);
    box-shadow: 0 0 40px rgba(0, 255, 240, 0.3),
                0 0 80px rgba(0, 229, 255, 0.15);
    transform: scale(1.02);
  }
`
