// app/lib/socials.ts
import { IconType } from "react-icons";
import { FaMastodon, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

interface SocialLink {
  href: string;
  label: string;
  icon: IconType;
}

export const SOCIAL_LINKS: SocialLink[] = [
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
