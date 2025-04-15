import { Metadata } from "next";
import NotFoundPage from "./components/NotFoundPage";

// Export metadata for this page
export const metadata: Metadata = {
  title: "@hyperb1iss | Signal Lost | 404",
  description: "The coordinates you've entered don't exist in this realm.",
  robots: {
    index: false,
    follow: false,
  },
};

// This is a server component that serves as the not-found page
export default function NotFound() {
  return <NotFoundPage />;
}
