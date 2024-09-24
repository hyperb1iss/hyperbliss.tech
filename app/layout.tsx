// app/layout.tsx
import { AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import siteMetadata from "./lib/metadata";
import StyledComponentsRegistry from "./lib/registry";
import "./styles/fonts.css";
import "./styles/globals.css";

export const metadata: Metadata = siteMetadata;

// Dynamically import the Analytics component (client-side only)
const Analytics = dynamic(() => import("./components/Analytics"), {
  ssr: false,
});

// Dynamically import DefaultSeo with ssr disabled
const SeoWrapper = dynamic(() => import("./components/SeoWrapper"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <SeoWrapper />
          <Header />
          <Analytics />
          <AnimatePresence mode="wait">
            <MainContent>{children}</MainContent>
          </AnimatePresence>
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
