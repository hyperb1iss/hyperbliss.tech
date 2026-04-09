export interface Experiment {
  slug: string
  title: string
  emoji: string
  description: string
  date: string
  tags: string[]
  status: 'live' | 'wip'
}

export const EXPERIMENTS: Experiment[] = [
  {
    date: '2026-04-08',
    description:
      '21 regular expressions dissected down to the molecular level. Interactive step-throughs, live testers, and the real-world disasters they caused.',
    emoji: '🔮',
    slug: 'regex-nightmares',
    status: 'live',
    tags: ['regex', 'interactive', 'deep-dive'],
    title: 'Regex Nightmares',
  },
]
