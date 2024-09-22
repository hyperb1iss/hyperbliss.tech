// src/pages/_document.tsx

import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
  } from 'next/document';
  import { ServerStyleSheet } from 'styled-components';
  
  /**
   * MyDocument customizes the default Document to include Styled Components' SSR.
   */
  class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
      const sheet = new ServerStyleSheet();
      const originalRenderPage = ctx.renderPage;
  
      try {
        // Collect styles from components in the page
        ctx.renderPage = () =>
          originalRenderPage({
            enhanceApp: (App) => (props) =>
              sheet.collectStyles(<App {...props} />),
          });
  
        // Extract the initial props that may be present
        const initialProps = await Document.getInitialProps(ctx);
  
        return {
          ...initialProps,
          // Combine initial styles with styled-components styles
          styles: (
            <>
              {initialProps.styles}
              {sheet.getStyleElement()}
            </>
          ),
        };
      } finally {
        sheet.seal();
      }
    }
  
    /**
     * Renders the Document component.
     */
    render() {
      return (
        <Html lang="en">
          <Head>
            {/* Import Fonts */}
            <link
              href="https://fonts.googleapis.com/css2?family=Proxima+Nova:wght@400;700&display=swap"
              rel="stylesheet"
            />
            {/* Meta tags for SEO and responsiveness */}
            <meta
              name="description"
              content="Hyperbliss - The personal website of Stefanie Kondik."
            />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
            {/* Additional tags */}
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
  }
  
  export default MyDocument;
  