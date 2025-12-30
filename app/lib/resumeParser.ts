// app/lib/resumeParser.ts
// A structure-based resume parser that understands markdown conventions, not specific content

export interface SkillItem {
  name: string
  url?: string
}

export interface ExperienceItem {
  company: string
  companyUrl?: string
  position: string
  period: string
  bullets: string[]
  technologies: SkillItem[]
}

export interface ProjectItem {
  name: string
  url?: string
  description: string
}

export interface ParsedResume {
  name: string
  tagline: string
  contact: {
    email?: string
    linkedin?: string
    github?: string
    website?: string
    links?: string
    [key: string]: string | undefined // Allow other contact types
  }
  summary: string
  skills: Record<string, SkillItem[]> // Dynamic skill categories
  experience: ExperienceItem[]
  projects: ProjectItem[]
  awards: string[]
  speaking: string[]
  education: string[]
  interests: string[]
  [key: string]: any // Allow other sections
}

// Helper to parse markdown links
function parseMarkdownLink(text: string): { text: string; url?: string } {
  const match = text.match(/\[(.+?)\]\((.+?)\)/)
  if (match) {
    return { text: match[1], url: match[2] }
  }
  return { text }
}

// Helper to extract all links from text and return them as SkillItems
function extractLinksAsItems(text: string): SkillItem[] {
  const items: SkillItem[] = []

  // Split by common delimiters
  const parts = text.split(/[,|]/)

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    // Check for markdown link
    const linkMatch = trimmed.match(/\[(.+?)\]\((.+?)\)/)
    if (linkMatch) {
      items.push({ name: linkMatch[1], url: linkMatch[2] })
    } else {
      // Remove any markdown formatting
      const clean = trimmed.replace(/\*\*/g, '').trim()
      if (clean) {
        items.push({ name: clean })
      }
    }
  }

  return items
}

// Helper to detect section type by keywords
function detectSectionType(heading: string): string {
  const lower = heading.toLowerCase()

  if (lower.includes('summar') || lower.includes('about') || lower.includes('profile')) {
    return 'summary'
  }
  if (lower.includes('skill') || lower.includes('technical') || lower.includes('expertise')) {
    return 'skills'
  }
  if (lower.includes('experience') || lower.includes('work') || lower.includes('employ')) {
    return 'experience'
  }
  if (lower.includes('project') || lower.includes('open source')) {
    return 'projects'
  }
  if (lower.includes('educat') || lower.includes('academic')) {
    return 'education'
  }
  if (lower.includes('award') || lower.includes('recognition') || lower.includes('achievement')) {
    return 'awards'
  }
  if (
    lower.includes('speak') ||
    lower.includes('talk') ||
    lower.includes('conference') ||
    lower.includes('presentation')
  ) {
    return 'speaking'
  }
  if (lower.includes('interest') || lower.includes('hobb')) {
    return 'interests'
  }

  return lower.replace(/[^a-z0-9]/g, '_') // Fallback: sanitized section name
}

// Main parser function
export function parseResume(markdown: string): ParsedResume {
  const lines = markdown.split('\n')
  const result: ParsedResume = {
    awards: [],
    contact: {},
    education: [],
    experience: [],
    interests: [],
    name: '',
    projects: [],
    skills: {},
    speaking: [],
    summary: '',
    tagline: '',
  }

  let currentH2Section = ''
  let currentH3Section = ''
  let currentExperience: Partial<ExperienceItem> | null = null
  let collectingParagraph = false
  let paragraphLines: string[] = []

  // Helper to save current experience
  const saveExperience = () => {
    if (currentExperience?.company) {
      result.experience.push({
        bullets: currentExperience.bullets || [],
        company: currentExperience.company || '',
        companyUrl: currentExperience.companyUrl,
        period: currentExperience.period || '',
        position: currentExperience.position || '',
        technologies: currentExperience.technologies || [],
      })
      currentExperience = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Handle empty lines - for summary section, preserve paragraph breaks
    if (!trimmed) {
      if (collectingParagraph && paragraphLines.length > 0 && currentH2Section === 'summary') {
        // In summary section, empty line means paragraph break - add separator
        paragraphLines.push('\n\n')
      }
      continue
    }

    // H1 - Name
    if (line.startsWith('# ')) {
      result.name = line.substring(2).trim()
      continue
    }

    // H2 - Major sections
    if (line.startsWith('## ')) {
      saveExperience()
      // Save summary if we were collecting it
      if (collectingParagraph && paragraphLines.length > 0 && currentH2Section === 'summary') {
        result.summary = paragraphLines
          .join(' ')
          .replace(/\s*\n\n\s*/g, '\n\n')
          .trim()
        collectingParagraph = false
        paragraphLines = []
      }
      const heading = line
        .substring(3)
        .replace(/[^\w\s&]/g, '')
        .trim()
      currentH2Section = detectSectionType(heading)
      currentH3Section = ''
      continue
    }

    // H3 - Subsections
    if (line.startsWith('### ')) {
      const heading = line.substring(4).trim()
      currentH3Section = heading

      // In experience section, H3 is company name
      if (currentH2Section === 'experience') {
        saveExperience()
        const link = parseMarkdownLink(heading)
        currentExperience = {
          bullets: [],
          company: link.text,
          companyUrl: link.url,
          technologies: [],
        }
      }
      // In skills section, H3 is a skill category
      else if (currentH2Section === 'skills') {
        if (!result.skills[heading]) {
          result.skills[heading] = []
        }
      }
      continue
    }

    // H4 - Sub-subsections
    if (line.startsWith('#### ')) {
      const heading = line.substring(5).trim()

      // In experience section, H4 is position
      // If we already have a position with bullets, save it and start a new role at same company
      if (currentH2Section === 'experience' && currentExperience) {
        if (currentExperience.position && currentExperience.bullets && currentExperience.bullets.length > 0) {
          // Save current role and start a new one at the same company
          saveExperience()
          currentExperience = {
            bullets: [],
            company: result.experience.length > 0 ? result.experience[result.experience.length - 1].company : '',
            companyUrl:
              result.experience.length > 0 ? result.experience[result.experience.length - 1].companyUrl : undefined,
            technologies: [],
          }
        }
        currentExperience.position = heading
      }
      continue
    }

    // Bold text at document start (after name) - Tagline
    if (!result.tagline && line.startsWith('**') && line.endsWith('**')) {
      result.tagline = line.replace(/\*\*/g, '').trim()
      continue
    }

    // Italic text (periods, metadata)
    if (line.startsWith('_') && line.endsWith('_')) {
      const content = line.replace(/_/g, '').trim()

      // Remove parentheses if present
      const period = content.replace(/^\(|\)$/g, '')

      if (currentH2Section === 'experience' && currentExperience) {
        currentExperience.period = period
      }
      continue
    }

    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      // Collect multi-line list items
      let itemText = line.substring(2).trim()
      let j = i + 1
      while (j < lines.length && lines[j].startsWith('  ') && !lines[j].trim().startsWith('-')) {
        itemText += ` ${lines[j].trim()}`
        j++
      }
      i = j - 1

      // Handle based on section
      if (currentH2Section === 'experience' && currentExperience) {
        // Check if it's technologies
        if (itemText.startsWith('**Technologies:**')) {
          const techStr = itemText.replace('**Technologies:**', '').trim()
          currentExperience.technologies = extractLinksAsItems(techStr)
        } else {
          currentExperience.bullets = currentExperience.bullets || []
          currentExperience.bullets.push(itemText)
        }
      } else if (currentH2Section === 'projects') {
        // Parse project formats:
        // 1. Original: **[Name](url)**: Description (bold wrapping link)
        // 2. TinaCMS converted: [**Name**](url): Description (link with bold text)
        // 3. Complex: **[Name](url)/[Name2](url2)**: Description

        // Try original format: **...**: followed by description
        const boldMatch = itemText.match(/\*\*(.+?)\*\*:\s*(.*)/)
        if (boldMatch) {
          const nameSection = boldMatch[1]
          const description = boldMatch[2] || ''
          // Extract first URL from the name section if present
          const urlMatch = nameSection.match(/\[([^\]]+)\]\(([^)]+)\)/)
          if (urlMatch) {
            result.projects.push({
              description: description.trim(),
              name: urlMatch[1].replace(/\*\*/g, ''), // Remove any bold markers
              url: urlMatch[2],
            })
          } else {
            result.projects.push({
              description: description.trim(),
              name: nameSection.trim(),
            })
          }
        } else {
          // Try TinaCMS format: [**Name**](url): Description or [...](url)**:
          // Match a markdown link followed by optional markers and colon
          const linkMatch = itemText.match(/\[([^\]]+)\]\(([^)]+)\)[^:]*:\s*(.*)/)
          if (linkMatch) {
            result.projects.push({
              description: linkMatch[3]?.trim() || '',
              name: linkMatch[1].replace(/\*\*/g, ''), // Remove bold markers from name
              url: linkMatch[2],
            })
          } else {
            // Last fallback: find colon that's NOT part of URL scheme (://)
            // Look for ": " (colon followed by space) as the separator
            const colonSpaceMatch = itemText.match(/^(.+?):\s+(.+)$/)
            if (colonSpaceMatch) {
              const namePart = colonSpaceMatch[1]
              const descPart = colonSpaceMatch[2]
              const link = parseMarkdownLink(namePart)
              result.projects.push({
                description: descPart.trim(),
                name: link.text.replace(/\*\*/g, ''),
                url: link.url,
              })
            }
          }
        }
      } else if (currentH2Section === 'awards') {
        result.awards.push(itemText)
      } else if (currentH2Section === 'speaking') {
        result.speaking.push(itemText)
      } else if (currentH2Section === 'education') {
        result.education.push(itemText)
      } else if (currentH2Section === 'interests') {
        result.interests.push(itemText)
      } else if (currentH2Section === 'skills' && currentH3Section && result.skills[currentH3Section]) {
        // Skills as list items
        const items = extractLinksAsItems(itemText)
        result.skills[currentH3Section].push(...items)
      }
      continue
    }

    // Contact info (paragraph with links near the top)
    if (!result.contact.email && trimmed.includes('@')) {
      // Parse contact line
      if (trimmed.includes('📧') || trimmed.toLowerCase().includes('email')) {
        const emailMatch = trimmed.match(/\[(.+?)\]\(mailto:(.+?)\)/)
        if (emailMatch) result.contact.email = emailMatch[2]
      }
      if (trimmed.includes('💼') || trimmed.toLowerCase().includes('linkedin')) {
        const match = trimmed.match(/\[.+?\]\((.+?linkedin.+?)\)/)
        if (match) result.contact.linkedin = match[1]
      }
      if (trimmed.includes('🐙') || trimmed.toLowerCase().includes('github')) {
        const match = trimmed.match(/\[.+?\]\((.+?github.+?)\)/)
        if (match) result.contact.github = match[1]
      }
      if (trimmed.includes('🌐') || trimmed.toLowerCase().includes('web')) {
        const match = trimmed.match(/\[.+?\]\((https?:\/\/.+?)\)/)
        if (match && !match[1].includes('linkedin') && !match[1].includes('github')) {
          result.contact.website = match[1]
        }
      }
      if (trimmed.includes('🔗') || trimmed.toLowerCase().includes('link')) {
        const match = trimmed.match(/\[.+?\]\((.+?)\)/)
        if (match) result.contact.links = match[1]
      }
      continue
    }

    // Skills section - handle paragraph format
    if (currentH2Section === 'skills' && currentH3Section) {
      // Check for subsection headers in bold
      if (trimmed.startsWith('**') && trimmed.includes(':**')) {
        const match = trimmed.match(/\*\*(.+?):\*\*\s*(.+)/)
        if (match) {
          const category = match[1]
          const items = extractLinksAsItems(match[2])
          result.skills[category] = items
          currentH3Section = category
        }
      }
      // Regular paragraph content for skills
      else if (currentH3Section && result.skills[currentH3Section] !== undefined) {
        const items = extractLinksAsItems(trimmed)
        result.skills[currentH3Section].push(...items)
      }
      // If no H3, treat the line as skill items under the H3 category
      else if (currentH3Section) {
        const items = extractLinksAsItems(trimmed)
        if (!result.skills[currentH3Section]) {
          result.skills[currentH3Section] = []
        }
        result.skills[currentH3Section].push(...items)
      }
      continue
    }

    // Summary section - collect as paragraph
    if (currentH2Section === 'summary') {
      collectingParagraph = true
      paragraphLines.push(trimmed)
    }
  }

  // Save any pending experience
  saveExperience()

  // Save any pending paragraph
  if (collectingParagraph && paragraphLines.length > 0) {
    if (currentH2Section === 'summary') {
      result.summary = paragraphLines
        .join(' ')
        .replace(/\s*\n\n\s*/g, '\n\n')
        .trim()
    }
  }

  return result
}
