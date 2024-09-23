// app/layout.tsx
import { Metadata } from "next";
import "./styles/globals.css";
import "./styles/fonts.css";
import StyledComponentsRegistry from "./lib/registry";
import siteMetadata from "./lib/metadata";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import { AnimatePresence } from "framer-motion";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Header />
          <AnimatePresence mode="wait">
            <MainContent>{children}</MainContent>
          </AnimatePresence>
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
