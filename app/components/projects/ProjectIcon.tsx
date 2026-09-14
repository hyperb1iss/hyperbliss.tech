import type { IconType } from 'react-icons'
import {
  FiActivity,
  FiAperture,
  FiArchive,
  FiBox,
  FiCode,
  FiCommand,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiGitBranch,
  FiGitPullRequest,
  FiGlobe,
  FiGrid,
  FiHome,
  FiLayers,
  FiLink,
  FiMessageSquare,
  FiMonitor,
  FiPackage,
  FiRadio,
  FiSettings,
  FiShield,
  FiSliders,
  FiSmartphone,
  FiSun,
  FiTerminal,
  FiTool,
  FiTriangle,
  FiWifi,
} from 'react-icons/fi'

const icons: Record<string, IconType> = {
  aeonsync: FiArchive,
  blocksd: FiGrid,
  chromacat: FiActivity,
  contexter: FiLayers,
  cosmosys: FiPackage,
  dotfiles: FiCommand,
  droidmind: FiSmartphone,
  'ghostty-automator': FiTerminal,
  'git-iris': FiGitBranch,
  'hermes-sibyl-memory': FiLink,
  'hyper-light-card': FiSliders,
  'hyperbliss-tech': FiGlobe,
  hypercolor: FiSun,
  'hypercolor-hass': FiHome,
  hyperskills: FiTool,
  'lightscript-workshop': FiCode,
  'next-dynenv': FiSettings,
  opaline: FiTriangle,
  prezzer: FiMonitor,
  q: FiMessageSquare,
  sibyl: FiDatabase,
  'signalrgb-homeassistant': FiRadio,
  'signalrgb-python': FiBox,
  'silkcircuit-nvim': FiCpu,
  silkprint: FiFileText,
  siren: FiShield,
  uchroma: FiAperture,
  unifly: FiWifi,
  vigil: FiGitPullRequest,
}

export default function ProjectIcon({ slug, size = 24 }: { slug: string; size?: number }) {
  const Icon = icons[slug] ?? FiBox
  return (
    <Icon
      aria-hidden="true"
      data-project-icon={slug}
      focusable="false"
      size={size}
      strokeWidth={1.5}
      style={{ color: 'var(--silk-circuit-cyan)', flexShrink: 0 }}
    />
  )
}
