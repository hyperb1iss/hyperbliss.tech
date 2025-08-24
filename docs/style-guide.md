# ✧･ﾟ: ✧･ﾟ 𝑯𝒚𝒑𝒆𝒓𝒃𝒍𝒊𝒔𝒔.𝒕𝒆𝒄𝒉 𝑺𝒕𝒚𝒍𝒆 𝑮𝒖𝒊𝒅𝒆 ･ﾟ✧:･ﾟ✧

<div align="center">

![](https://img.shields.io/badge/VERSION-1.0-a259ff?style=for-the-badge)
![](https://img.shields.io/badge/STATUS-LIVE-00fff0?style=for-the-badge)
![](https://img.shields.io/badge/AESTHETIC-COSMIC-ff75d8?style=for-the-badge)

</div>

## ⋆｡˚ 🌠 ⋆｡˚☽˚｡⋆ 𝙄𝙣𝙩𝙧𝙤𝙙𝙪𝙘𝙩𝙞𝙤𝙣 ⋆｡˚☽˚｡⋆ 🌠 ⋆｡˚

Welcome to the `hyperbliss.tech` style guide — a portal into our digital
dreamscape where code meets cosmic energy. This document serves as the
definitive reference for maintaining consistency across our digital universe,
ensuring every pixel pulses with the same ethereal energy.

Our aesthetic channels the essence of a digital witch's sanctuary — a space
where cutting-edge technology interfaces with magical ambiance. We blend
cyberpunk sensibilities with cosmic wonder, creating interfaces that feel
simultaneously futuristic and enchanted.

## ⚡ 𝘿𝙚𝙨𝙞𝙜𝙣 𝙋𝙝𝙞𝙡𝙤𝙨𝙤𝙥𝙝𝙮 ⚡

The `hyperbliss.tech` experience is guided by these core principles:

```
⊹ ETHEREAL DEPTH     ⊹ RESPONSIVE MAGIC     ⊹ INTERACTIVE ENCHANTMENT
⊹ MAGICAL CONTRAST   ⊹ NAVIGATIONAL FLOW    ⊹ TYPOGRAPHIC HARMONY
```

We create interfaces that:

- **Glow with purpose** — Every element emits light with intention
- **Flow like stardust** — Animations move with cosmic elegance
- **Respond like magic** — Interactions feel satisfying and slightly
  supernatural
- **Balance complexity** — Intricate enough to intrigue, clear enough to
  navigate
- **Evoke wonder** — Each visit should feel like entering a digital sanctuary

## 🎨 𝘾𝙤𝙡𝙤𝙧 𝙋𝙖𝙡𝙚𝙩𝙩𝙚 🎨

Our color palette draws from the cosmic spectrum — ethereal purples, electric
pinks, and digital cyans set against the void of space.

### 𝙋𝙧𝙞𝙢𝙖𝙧𝙮 𝘾𝙤𝙡𝙤𝙧𝙨

| Color Name    | Hex Value | RGB Value            | Usage                                      |
| ------------- | --------- | -------------------- | ------------------------------------------ |
| Cosmic Purple | `#a259ff` | `rgb(162, 89, 255)`  | Primary brand color, headings, accents     |
| Neon Pink     | `#ff75d8` | `rgb(255, 117, 216)` | Secondary highlights, interactive elements |
| Digital Cyan  | `#00fff0` | `rgb(0, 255, 240)`   | Tertiary accents, links, glowing elements  |
| Void Black    | `#0a0a14` | `rgb(10, 10, 20)`    | Backgrounds, containers                    |
| Starlight     | `#e0e0e0` | `rgb(224, 224, 224)` | Body text, subtle elements                 |

### 𝙂𝙧𝙖𝙙𝙞𝙚𝙣𝙩𝙨 & 𝙂𝙡𝙤𝙬𝙨

Gradients should follow these patterns:

```css
/* Standard Gradient */
background: linear-gradient(
  135deg,
  var(--color-primary),
  var(--color-secondary)
);

/* Cosmic Gradient (Logo) */
background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
background-size: 800% 800%;

/* Neon Glow */
box-shadow:
  0 0 5px rgba(0, 255, 255, 0.6),
  0 0 10px rgba(0, 255, 255, 0.5),
  0 0 20px rgba(0, 255, 255, 0.4);
```

### 𝘾𝙤𝙡𝙤𝙧 𝙐𝙨𝙖𝙜𝙚 𝙂𝙪𝙞𝙙𝙚𝙡𝙞𝙣𝙚𝙨

- **Text Hierarchy**:
  - Headings: Cosmic Purple (`#a259ff`)
  - Subheadings: Neon Pink (`#ff75d8`)
  - Body: Starlight (`#e0e0e0`)
  - Links: Digital Cyan (`#00fff0`)

- **Interactive Elements**:
  - Default: Digital Cyan (`#00fff0`)
  - Hover: Neon Pink (`#ff75d8`)
  - Active/Selected: Cosmic Purple (`#a259ff`)

- **Backgrounds**:
  - Primary: Void Black (`#0a0a14`)
  - Cards/Containers: Slightly lighter black with transparency
    (`rgba(255, 255, 255, 0.025)`)
  - Highlights: Gradients of primary colors

## 🔮 𝙏𝙮𝙥𝙤𝙜𝙧𝙖𝙥𝙝𝙮 𝙎𝙮𝙨𝙩𝙚𝙢 🔮

Typography in `hyperbliss.tech` is designed to enhance readability while
maintaining our cosmic aesthetic. We use a combination of futuristic display
fonts and clean sans-serif typefaces.

### 𝙁𝙤𝙣𝙩 𝙁𝙖𝙢𝙞𝙡𝙞𝙚𝙨

```css
--font-heading: 'Orbitron', sans-serif; /* Futuristic, sharp, technical */
--font-body: 'Rajdhani', sans-serif; /* Clean, readable with techno character */
--font-mono:
  'Space Mono', monospace; /* For code blocks and technical content */
--font-logo: 'Noto Sans', sans-serif; /* Clean base for stylized logo text */
```

### 𝙏𝙮𝙥𝙚 𝙎𝙘𝙖𝙡𝙚

We implement responsive typography using `clamp()` to ensure text remains
proportional across devices:

```css
/* Example type scale */
h1 {
  font-size: clamp(3rem, 5vw, 6rem);
}
h2 {
  font-size: clamp(2.5rem, 3.5vw, 4.5rem);
}
h3 {
  font-size: clamp(1.8rem, 2vw, 2.4rem);
}
p {
  font-size: clamp(1.4rem, 1.5vw, 1.8rem);
}
```

### 𝙏𝙮𝙥𝙚 𝙏𝙧𝙚𝙖𝙩𝙢𝙚𝙣𝙩𝙨

- **Headings**:
  - Uppercase treatment
  - Letter spacing: 1.5-2px
  - Text shadow for glow effect: `text-shadow: 0 0 20px var(--color-primary);`

- **Body Text**:
  - Regular case
  - Line height: 1.6
  - Text shadow for subtle enhancement:
    `text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);`

- **Special Text Effects**:
  - Gradient text: Uses background clip for color fills
  - Glitch effect: Applied via `GlitchSpan` component
  - Sparkling effect: Applied via `SparklingName` component

## ✨ 𝘾𝙤𝙢𝙥𝙤𝙣𝙚𝙣𝙩 𝙎𝙩𝙮𝙡𝙚𝙨 ✨

Our component library features consistent styling patterns that should be
followed for all new components.

### 𝘾𝙖𝙧𝙙𝙨

Cards are a primary container element throughout the site:

```css
background: rgba(255, 255, 255, 0.025);
backdrop-filter: blur(5px);
border: 1px solid rgba(162, 89, 255, 0.2);
border-radius: 15px;
padding: 2rem;
transition: all 0.3s ease;
box-shadow: 0 0 10px rgba(162, 89, 255, 0.3);
```

On hover:

```css
box-shadow:
  0 0 20px rgba(162, 89, 255, 0.6),
  0 0 40px rgba(162, 89, 255, 0.4);
transform: translateY(-5px);
border-color: rgb(162, 89, 255);
```

### 𝘽𝙪𝙩𝙩𝙤𝙣𝙨

Primary buttons feature a border with fill-on-hover effect:

```css
background-color: transparent;
color: var(--color-accent);
padding: 1rem 2rem;
border: 2px solid var(--color-accent);
border-radius: 50px;
font-weight: bold;
text-transform: uppercase;
transition: all 0.3s ease;
position: relative;
overflow: hidden;
```

With before pseudo-element for fill effect:

```css
&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-accent);
  z-index: -1;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

&:hover {
  color: var(--color-background);
  box-shadow: 0 0 15px rgba(162, 89, 255, 0.7);
}

&:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 𝙏𝙖𝙜𝙨

Tags are used for categorization and filtering:

```css
background-color: rgba(162, 89, 255, 0.1);
color: var(--color-accent);
padding: 0.5rem 1rem;
border-radius: 2rem;
font-size: clamp(1.3rem, 1.5vw, 1.6rem);
transition: all 0.3s ease;
border: 1px solid rgba(162, 89, 255, 0.3);
```

On hover:

```css
background-color: rgba(162, 89, 255, 0.2);
transform: translateY(-2px);
box-shadow: 0 4px 8px rgba(162, 89, 255, 0.4);
```

### 𝙄𝙣𝙥𝙪𝙩 𝙁𝙞𝙚𝙡𝙙𝙨

Text inputs maintain our cosmic aesthetic:

```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(162, 89, 255, 0.3);
border-radius: 5px;
padding: 1rem;
color: var(--color-text);
transition: all 0.3s ease;
font-family: var(--font-body);
```

On focus:

```css
border-color: var(--color-accent);
box-shadow: 0 0 10px rgba(0, 255, 240, 0.4);
outline: none;
```

## 🌟 𝘼𝙣𝙞𝙢𝙖𝙩𝙞𝙤𝙣 𝙋𝙧𝙞𝙣𝙘𝙞𝙥𝙡𝙚𝙨 🌟

Animations in `hyperbliss.tech` create a sense of magical interactivity. We use
Framer Motion for most animations, with these guidelines:

### 𝘼𝙣𝙞𝙢𝙖𝙩𝙞𝙤𝙣 𝙏𝙮𝙥𝙚𝙨

1. **Entrance/Exit Animations**

   ```jsx
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   exit={{ opacity: 0, y: -20 }}
   transition={{ duration: 0.5, ease: "easeOut" }}
   ```

2. **Hover Effects**

   ```jsx
   whileHover={{ scale: 1.05 }}
   whileTap={{ scale: 0.95 }}
   ```

3. **Staggered Children**
   ```jsx
   variants={{
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: {
         staggerChildren: 0.3,
       },
     },
   }}
   ```

### 𝙎𝙥𝙚𝙘𝙞𝙖𝙡 𝙀𝙛𝙛𝙚𝙘𝙩𝙨

Our site features several signature animation effects:

1. **Glitch Effect**
   - Used for emphasizing words or creating cyberpunk atmosphere
   - Implemented via the `GlitchSpan` component

2. **Sparkling Name**
   - Used for name emphasis and magical highlighting
   - Implemented via the `SparklingName` component

3. **Logo Animation**
   - Multiple effects including gradient cycling, flicker, and chromatic
     aberration
   - Creates a distinctive, memorable brand presence

4. **CyberScape Background**
   - Interactive particle system that responds to user interaction
   - Creates depth and immersion throughout the site

### 𝙋𝙚𝙧𝙛𝙤𝙧𝙢𝙖𝙣𝙘𝙚 𝙂𝙪𝙞𝙙𝙚𝙡𝙞𝙣𝙚𝙨

- Use `will-change` property judiciously for hardware acceleration
- Throttle/debounce event handlers for smooth interactions
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Adjust particle count and effect complexity based on device capabilities

## 🔲 𝙇𝙖𝙮𝙤𝙪𝙩 & 𝙎𝙥𝙖𝙘𝙞𝙣𝙜 🔲

Our layout system ensures consistency while adapting to different screen sizes.

### 𝙎𝙥𝙖𝙘𝙞𝙣𝙜 𝙎𝙮𝙨𝙩𝙚𝙢

We use a modular spacing system with these common values:

```css
/* Base unit: 1rem (10px at root font-size of 62.5%) */
--space-xs: 0.5rem; /* 5px */
--space-sm: 1rem; /* 10px */
--space-md: 2rem; /* 20px */
--space-lg: 4rem; /* 40px */
--space-xl: 8rem; /* 80px */
```

### 𝙇𝙖𝙮𝙤𝙪𝙩 𝘾𝙤𝙣𝙩𝙖𝙞𝙣𝙚𝙧𝙨

- **Max-width containers**:

  ```css
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  ```

- **Responsive adjustments**:

  ```css
  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 6rem 1rem 1rem;
  }
  ```

### 𝙂𝙧𝙞𝙙 𝙎𝙮𝙨𝙩𝙚𝙢

We use CSS Grid for complex layouts with these common patterns:

```css
/* Card grid */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 2rem;

/* Content grid */
display: grid;
grid-template-columns: 1fr 2fr;
gap: 3rem;

@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

## 🖥️ 𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙞𝙫𝙚 𝘿𝙚𝙨𝙞𝙜𝙣 🖥️

Our responsive approach ensures the site works beautifully across all devices.

### 𝘽𝙧𝙚𝙖𝙠𝙥𝙤𝙞𝙣𝙩𝙨

```css
--breakpoint-sm: 480px;
--breakpoint-md: 768px;
--breakpoint-lg: 1200px;
--breakpoint-xl: 1600px;
```

### 𝙈𝙚𝙙𝙞𝙖 𝙌𝙪𝙚𝙧𝙮 𝙋𝙖𝙩𝙩𝙚𝙧𝙣𝙨

```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile-specific styles */
}

/* Tablet and small desktops */
@media (min-width: 769px) and (max-width: 1199px) {
  /* Tablet-specific styles */
}

/* Large desktops */
@media (min-width: 1200px) {
  /* Desktop-specific styles */
}

/* Extra large screens */
@media (min-width: 1600px) {
  /* Extra large screen optimizations */
}
```

## 💫 𝙎𝙥𝙚𝙘𝙞𝙖𝙡 𝙀𝙛𝙛𝙚𝙘𝙩𝙨 & 𝙐𝙩𝙞𝙡𝙞𝙩𝙞𝙚𝙨 💫

### 𝙂𝙡𝙤𝙬 𝙀𝙛𝙛𝙚𝙘𝙩𝙨

```css
/* Text glow */
text-shadow:
  0 0 5px var(--color-primary),
  0 0 10px var(--color-primary);

/* Box glow */
box-shadow:
  0 0 10px rgba(0, 255, 255, 0.6),
  0 0 20px rgba(0, 255, 255, 0.4);
```

### 𝙂𝙧𝙖𝙙𝙞𝙚𝙣𝙩 𝙏𝙚𝙭𝙩

```css
background: linear-gradient(
  45deg,
  var(--color-primary),
  var(--color-accent),
  var(--color-secondary)
);
background-size: 200% 200%;
animation: gradientShift 5s ease infinite;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### 𝘾𝙤𝙧𝙣𝙚𝙧 𝘼𝙘𝙘𝙚𝙣𝙩𝙨

```css
/* Cyberpunk corner accent */
&::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(
    45deg,
    transparent 50%,
    rgba(0, 255, 255, 0.1) 50%
  );
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}
```

## ⚙️ 𝙏𝙚𝙘𝙝𝙣𝙞𝙘𝙖𝙡 𝙄𝙢𝙥𝙡𝙚𝙢𝙚𝙣𝙩𝙖𝙩𝙞𝙤𝙣 ⚙️

### 𝙎𝙩𝙮𝙡𝙚𝙙 𝙃𝙚𝙡𝙥𝙚𝙧𝙨

When implementing new components, use these patterns:

```jsx
// Importing styled-components
import styled from 'styled-components'

// Base component with props
const MyComponent =
  styled.div <
  { $color: string } >
  `
  color: ${(props) => `rgb(${props.$color})`};
  background: rgba(255, 255, 255, 0.025);
  
  /* Add hover effects */
  &:hover {
    color: ${(props) => `rgb(${props.$color})`};
    transform: translateY(-2px);
  }
`

// Responsive adjustments
const ResponsiveComponent = styled.div`
  font-size: clamp(1.4rem, 1.6vw, 2rem);
  width: 100%;

  @media (min-width: 768px) {
    width: 85%;
  }
`
```

### 𝘼𝙣𝙞𝙢𝙖𝙩𝙞𝙤𝙣 𝙄𝙢𝙥𝙡𝙚𝙢𝙚𝙣𝙩𝙖𝙩𝙞𝙤𝙣

```jsx
// Using Framer Motion
import { motion } from 'framer-motion'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

// Implementation
;<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.h1 variants={itemVariants}>Animated Title</motion.h1>
  <motion.p variants={itemVariants}>Animated paragraph</motion.p>
</motion.div>
```

## 🧙‍♀️ 𝙏𝙤𝙣𝙚 & 𝙑𝙤𝙞𝙘𝙚 𝙂𝙪𝙞𝙙𝙚 🧙‍♀️

The voice of `hyperbliss.tech` reflects Stefanie Jane's multifaceted
personality: technical, magical, and warmly approachable.

### 𝙏𝙤𝙣𝙚 𝘼𝙩𝙩𝙧𝙞𝙗𝙪𝙩𝙚𝙨

- **Playful & Creative**: Cosmic, colorful, magical themes
- **Technical & Precise**: Clear explanations with depth when needed
- **Warm & Conversational**: Friendly, approachable communication
- **Clever but Accessible**: Witty without being exclusionary
- **Authentic & Personal**: True to Stefanie's personality

### 𝙒𝙧𝙞𝙩𝙞𝙣𝙜 𝙏𝙞𝙥𝙨

- Use emoji selectively to emphasize points ✨🚀🌈💫
- Balance technical precision with warmth
- Keep paragraphs concise for better readability
- Incorporate subtle references to personal interests when relevant
- Maintain an inclusive, welcoming tone throughout

## 🦄 𝙄𝙢𝙖𝙜𝙚𝙧𝙮 & 𝙄𝙘𝙤𝙣𝙨 🦄

### 𝙄𝙢𝙖𝙜𝙚 𝙏𝙧𝙚𝙖𝙩𝙢𝙚𝙣𝙩

Images should maintain the site's aesthetic with these treatments:

```css
/* Profile images */
border-radius: 50% / 40%;
filter: saturate(1.4) brightness(1.05);
box-shadow:
  0 0 5px rgba(0, 255, 255, 0.6),
  0 0 10px rgba(0, 255, 255, 0.5),
  0 0 20px rgba(0, 255, 255, 0.4);
border: 2px solid rgba(0, 255, 255, 0.2);
```

### 𝙄𝙘𝙤𝙣 𝙐𝙨𝙖𝙜𝙚

We use React Icons, primarily from the `Fa` and `Io` collections. Icons should:

- Match the color scheme of surrounding elements
- Have appropriate size (usually 1.2-1.5× the font size)
- Include hover effects when interactive
- Use subtle glow effects to match the overall aesthetic

## 🧵 𝘾𝙤𝙙𝙚 𝙄𝙢𝙥𝙡𝙚𝙢𝙚𝙣𝙩𝙖𝙩𝙞𝙤𝙣 𝙂𝙪𝙞𝙙𝙚𝙡𝙞𝙣𝙚𝙨 🧵

### 𝙉𝙖𝙢𝙞𝙣𝙜 𝘾𝙤𝙣𝙫𝙚𝙣𝙩𝙞𝙤𝙣𝙨

- **Component Files**: PascalCase (e.g., `GlitchSpan.tsx`)
- **Styled Components**: PascalCase with descriptive names (e.g.,
  `StyledButton`)
- **CSS Variables**: kebab-case (e.g., `--color-primary`)
- **Props**: camelCase, with `$` prefix for styled-component props (e.g.,
  `$color`)

### 𝙎𝙩𝙮𝙡𝙚𝙙 𝘾𝙤𝙢𝙥𝙤𝙣𝙚𝙣𝙩𝙨 𝙋𝙖𝙩𝙩𝙚𝙧𝙣

```jsx
// Component structure
import styled from 'styled-components'

// Base components
const ComponentWrapper = styled.div`
  /* Base styles */
`

const ComponentTitle = styled.h2`
  /* Title styles */
`

// Component implementation
const MyComponent = ({ title, children }) => {
  return (
    <ComponentWrapper>
      <ComponentTitle>{title}</ComponentTitle>
      {children}
    </ComponentWrapper>
  )
}

export default MyComponent
```

### 𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙞𝙫𝙚 𝙋𝙖𝙩𝙩𝙚𝙧𝙣𝙨

```jsx
// Using clamp for fluid typography
const Title = styled.h1`
  font-size: clamp(3rem, 5vw, 6rem);

  /* Additional media queries as needed */
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`

// Responsive containers
const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
  }
`
```

## ✧･ﾟ: ✧･ﾟ 𝙁𝙞𝙣𝙖𝙡 𝙉𝙤𝙩𝙚𝙨 ･ﾟ✧:･ﾟ✧

This style guide is a living document that will evolve alongside
`hyperbliss.tech`. As new components and patterns emerge, they should be
documented here for consistency and reference.

Remember that while aesthetics are important, usability and accessibility should
never be compromised. Our cosmic digital realm should be navigable and enjoyable
for everyone, regardless of their abilities or devices.

<div align="center">

✧･ﾟ: _✧･ﾟ:_ _:･ﾟ✧_:･ﾟ✧

Created with 💜 by [Stefanie Jane](https://hyperbliss.tech)

_Where code meets cosmic magic_

✧･ﾟ: _✧･ﾟ:_ _:･ﾟ✧_:･ﾟ✧

</div>
