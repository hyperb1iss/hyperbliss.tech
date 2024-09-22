'use client'; // Keep the use client directive

import StyledComponentsRegistry from './components/StyledComponentsRegistry';
import { GlobalStyle } from './styles/globalStyles';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { DefaultSeo } from 'next-seo';
import SEO from './next-seo.config';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Import Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@300;400;500;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
        {/* Meta tags for SEO and responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicon */}
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
