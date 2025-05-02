import { Orbitron, Rajdhani, Space_Mono, Noto_Sans } from "next/font/google";

// Define Orbitron font
export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-orbitron", // CSS variable name
});

// Define Rajdhani font
export const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-rajdhani", // CSS variable name
});

// Define Space Mono font
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"], // Assuming default weight is 400
  display: "swap",
  variable: "--font-space-mono", // CSS variable name
});

// Define Noto Sans font for the logo
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400"], // Assuming default weight is 400
  display: "swap",
  variable: "--font-noto-sans", // CSS variable name
});

// CSS variables to use in styled-components
export const fontVariables = {
  orbitron: orbitron.variable,
  rajdhani: rajdhani.variable,
  spaceMono: spaceMono.variable,
  notoSans: notoSans.variable,
};

// Class names to add to elements
export const fontClassNames = {
  orbitron: orbitron.className,
  rajdhani: rajdhani.className,
  spaceMono: spaceMono.className,
  notoSans: notoSans.className,
};
