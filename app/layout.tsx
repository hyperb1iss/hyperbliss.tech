// app/layout.tsx
import { AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import Header from "./components/Header";
import HeaderFade from "./components/HeaderFade";
import { HeaderProvider } from "./components/HeaderContext";
import GlobalLayout from "./components/GlobalLayout";
import siteMetadata from "./lib/metadata";
import StyledComponentsRegistry from "./lib/registry";
import HyperspaceLoader from "./components/HyperspaceLoader";
import ClientComponents from "./components/ClientComponents";
import StructuredData from "./components/StructuredData";
import { generatePersonSchema, generateWebsiteSchema } from "./lib/structuredData";
import { orbitron, rajdhani, spaceMono, notoSans } from "./styles/fonts";
import "./styles/globals.css";

export const metadata: Metadata = siteMetadata;

/**
 * RootLayout component
 * The main layout component that wraps the entire application.
 * Provides global context, headers, and scripts.
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Rendered root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = [generateWebsiteSchema(), generatePersonSchema()];

  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${spaceMono.variable} ${notoSans.variable}`}
    >
      <head>
        <StructuredData data={structuredData} />
      </head>
      <body>
        <StyledComponentsRegistry>
          <HeaderProvider>
            <ClientComponents />
            <Header />
            <HeaderFade />
            <HyperspaceLoader />
            <GlobalLayout>
              <AnimatePresence mode="wait">{children}</AnimatePresence>
            </GlobalLayout>
          </HeaderProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
