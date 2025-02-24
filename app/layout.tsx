// app/layout.tsx
import { AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import Script from "next/script";
import Header from "./components/Header";
import HeaderFade from "./components/HeaderFade";
import { HeaderProvider } from "./components/HeaderContext";
import GlobalLayout from "./components/GlobalLayout";
import siteMetadata from "./lib/metadata";
import StyledComponentsRegistry from "./lib/registry";
import ClientComponents from "./components/ClientComponents";
import "./styles/fonts.css";
import "./styles/globals.css";

export const metadata: Metadata = siteMetadata;

/**
 * RootLayout component
 * The main layout component that wraps the entire application.
 * Provides global context, headers, and scripts.
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Rendered root layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <HeaderProvider>
            <ClientComponents />
            <Header />
            <HeaderFade />
            <GlobalLayout>
              <AnimatePresence mode="wait">{children}</AnimatePresence>
            </GlobalLayout>
          </HeaderProvider>
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
