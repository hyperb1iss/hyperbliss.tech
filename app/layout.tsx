// app/layout.tsx
import { Metadata } from 'next';
import './styles/globals.css';
import './styles/fonts.css';
import StyledComponentsRegistry from './lib/registry';
import siteMetadata from './lib/metadata';
import PageWrapper from './components/PageWrapper';

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
          <PageWrapper>{children}</PageWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
