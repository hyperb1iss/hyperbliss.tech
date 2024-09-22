// src/pages/_app.tsx

import type { AppProps } from "next/app";
import { GlobalStyle } from "./styles/globalStyles";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { DefaultSeo } from "next-seo";
import SEO from "./next-seo.config";

/**
 * MyApp is the custom App component for Next.js, wrapping all pages.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <GoogleAnalytics trackPageViews />
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
