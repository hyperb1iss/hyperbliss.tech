import { Metadata } from 'next'
import NotFoundPage from './components/NotFoundPage'

// Export metadata for this page
export const metadata: Metadata = {
  description: "You've wandered beyond mapped reality. The signal here is fractured—data ghosts flicker in the static.",
  robots: {
    follow: false,
    index: false,
  },
  title: '@hyperb1iss | Transmission Interrupted | 404',
}

// This is a server component that serves as the not-found page
export default function NotFound() {
  return <NotFoundPage />
}
