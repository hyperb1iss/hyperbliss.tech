// app/layout.tsx
import { AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
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
        <Script id="tagline" strategy="afterInteractive">
        {`
            console.log(
              "%c 🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹ ",
              'background: linear-gradient(90deg, #000033 0%, #0033cc 25%, #6600cc 50%, #cc00ff 75%, #ff00ff 100%); color: #00ffff; font-weight: bold; padding: 5px; border-radius: 5px; font-size: 14px; text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 35px #00ffff, 0 0 40px #00ffff, 0 0 50px #00ffff, 0 0 75px #00ffff;'
            );
        `}
        </Script>
      </body>
    </html>
  );
}
