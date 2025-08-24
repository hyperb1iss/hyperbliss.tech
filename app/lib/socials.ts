// app/lib/socials.ts
import { IconType } from 'react-icons'
import { FaBluesky, FaGithub, FaInstagram, FaLinkedin, FaMastodon, FaSpotify } from 'react-icons/fa6'

/**
 * Interface for social media link objects
 */
interface SocialLink {
  href: string
  label: string
  icon: IconType
}

/**
 * Array of social media links
 * Contains information for rendering social media icons and links
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://bsky.app/profile/hyperbliss.tech',
    icon: FaBluesky,
    label: 'Bluesky',
  },
  {
    href: 'https://hachyderm.io/@bliss',
    icon: FaMastodon,
    label: 'Mastodon',
  },
  {
    href: 'https://instagram.com/hyperb1iss',
    icon: FaInstagram,
    label: 'Instagram',
  },
  {
    href: 'https://linkedin.com/in/hyperb1iss',
    icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/hyperb1iss',
    icon: FaGithub,
    label: 'GitHub',
  },
  {
    href: 'https://open.spotify.com/user/12173574470',
    icon: FaSpotify,
    label: 'Spotify',
  },
]
