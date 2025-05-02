import { Inter, Fira_Code } from "next/font/google";

// Define fonts with optimized loading
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
  weight: ["400", "500", "700"],
});

// CSS variables to use in styled-components
export const fontVariables = {
  inter: inter.variable,
  firaCode: firaCode.variable,
};

// Class names to add to elements
export const fontClassNames = {
  inter: inter.className,
  firaCode: firaCode.className,
};
