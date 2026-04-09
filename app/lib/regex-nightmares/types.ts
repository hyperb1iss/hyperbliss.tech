export type SegmentColor = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange'

export interface RegexSegment {
  pattern: string
  label: string
  description: string
  color: SegmentColor
}

export interface RegexTestCase {
  input: string
  shouldMatch: boolean
  label: string
}

export interface RegexNightmareEntry {
  id: number
  title: string
  emoji: string
  regex: string
  category: 'clever' | 'cursed' | 'awesome'
  dangerLevel: 1 | 2 | 3 | 4 | 5
  section: 'main' | 'appendix'
  segments: RegexSegment[]
  subtitle: string
  explanation: string
  bodyCount?: {
    emoji: string
    label: string
    content: string
  }
  testCases: RegexTestCase[]
  jsCompatible: boolean
  jsRegex?: string
  flags?: string
  pcrePattern?: string
  jsValidator?: (input: string) => boolean
}
