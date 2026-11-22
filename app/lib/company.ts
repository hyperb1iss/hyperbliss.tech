// The facts every surface repeats, read from one place. The tagline and the
// site description live in content/pages/home.json; the hero, the footer, the
// social card, the page metadata and the feeds all read them from here, so a
// new tagline is one edit.

import home from '../../content/pages/home.json'

export const BASE_URL = 'https://hyperbliss.tech'
export const COMPANY_NAME = 'Hyperbliss Technologies'
export const COMPANY_LEGAL_NAME = 'Hyperbliss Technologies LLC'
export const FOUNDER_NAME = 'Stefanie Jane'
export const CONTACT_EMAIL = 'stef@hyperbliss.tech'

/** The headline as the hero sets it, one entry per line. */
export const TAGLINE_LINES: readonly string[] = home.front.headline
export const TAGLINE = TAGLINE_LINES.join(' ')
/** Which line of the headline is lit, counted from 0. */
export const TAGLINE_ACCENT: number = home.front.headlineAccent
export const SITE_DESCRIPTION: string = home.description
