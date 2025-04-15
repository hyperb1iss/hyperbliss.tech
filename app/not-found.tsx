import { Metadata } from "next";
import NotFoundPage from "./components/NotFoundPage";

// Export metadata for this page
export const metadata: Metadata = {
  title: "@hyperb1iss | Transmission Interrupted | 404",
  description:
    "You've wandered beyond mapped reality. The signal here is fractured—data ghosts flicker in the static.",
  robots: {
    index: false,
    follow: false,
  },
};

// This is a server component that serves as the not-found page
export default function NotFound() {
  return <NotFoundPage />;
}
