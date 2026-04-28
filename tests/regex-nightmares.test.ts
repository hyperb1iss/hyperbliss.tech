import { REGEX_NIGHTMARES } from '@/lib/regex-nightmares/data'
import { evaluateRegexInput } from '@/lib/regex-nightmares/evaluator'

describe('Regex Nightmares corpus', () => {
  it('keeps every interactive test case aligned with the configured JavaScript evaluator', () => {
    const failures: string[] = []

    for (const entry of REGEX_NIGHTMARES) {
      for (const testCase of entry.testCases) {
        const result = evaluateRegexInput({
          flags: entry.flags,
          input: testCase.input,
          jsRegex: entry.jsRegex,
          jsValidator: entry.jsValidator,
          matchMode: entry.matchMode,
          regex: entry.regex,
        })

        if (result.error) {
          failures.push(`${entry.id}. ${entry.title} failed to compile: ${result.error}`)
        } else if (result.isMatch !== testCase.shouldMatch) {
          failures.push(
            `${entry.id}. ${entry.title} expected ${JSON.stringify(testCase.input)} to ${
              testCase.shouldMatch ? 'match' : 'miss'
            }, got ${result.isMatch ? 'match' : 'miss'}`,
          )
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('reports repeated matches once per actual global hit, even when non-global flags are configured', () => {
    const emailEntry = REGEX_NIGHTMARES.find((entry) => entry.id === 1)
    expect(emailEntry).toBeDefined()

    const result = evaluateRegexInput({
      flags: emailEntry?.flags,
      input: 'user@example.com and admin@example.org',
      jsRegex: emailEntry?.jsRegex,
      regex: emailEntry?.regex ?? '',
    })

    expect(result.error).toBeNull()
    expect(result.matches).toHaveLength(2)
  })

  it('makes zero-width search-mode matches visible without pretending they consume text', () => {
    const voidEntry = REGEX_NIGHTMARES.find((entry) => entry.id === 21)
    expect(voidEntry).toBeDefined()

    const result = evaluateRegexInput({
      input: 'hello',
      jsRegex: voidEntry?.jsRegex,
      matchMode: voidEntry?.matchMode,
      regex: voidEntry?.regex ?? '',
    })

    expect(result.error).toBeNull()
    expect(result.isMatch).toBe(true)
    expect(result.matches[0]).toMatchObject({ end: 0, start: 0, text: '' })
  })
})
