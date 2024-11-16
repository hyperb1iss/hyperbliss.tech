// app/lib/socials.ts
import { IconType } from "react-icons";
import {
  FaBluesky,
  FaMastodon,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa6";

/**
 * Interface for social media link objects
 */
interface SocialLink {
  href: string;
  label: string;
  icon: IconType;
}

/**
 * Array of social media links
 * Contains information for rendering social media icons and links
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://bsky.app/profile/hyperbliss.tech",
    label: "Bluesky",
    icon: FaBluesky,
  },
  {
    href: "https://hachyderm.io/@bliss",
    label: "Mastodon",
    icon: FaMastodon,
  },
  {
    href: "https://instagram.com/hyperb1iss",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    href: "https://linkedin.com/in/hyperb1iss",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    href: "https://github.com/hyperb1iss",
    label: "GitHub",
    icon: FaGithub,
  },
];
