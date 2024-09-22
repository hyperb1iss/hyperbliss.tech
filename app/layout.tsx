"use client";

import StyledComponentsRegistry from "./components/StyledComponentsRegistry";
import { GlobalStyle } from "./styles/globalStyles";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { DefaultSeo } from "next-seo";
import SEO from "./next-seo.config";
import "./styles/fonts.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <GoogleAnalytics trackPageViews />
          <DefaultSeo {...SEO} />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}