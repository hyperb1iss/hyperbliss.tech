import type { RegexNightmareEntry } from './types'

export const REGEX_NIGHTMARES: RegexNightmareEntry[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. RFC 5322 Email Validator
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content: `The Perl module [Mail::RFC822::Address](https://metacpan.org/pod/Mail::RFC822::Address) generated a regex from the RFC 822 grammar that clocked in at over 6,000 characters. The [OWASP Validation Regex Repository](https://owasp.org/www-community/OWASP_Validation_Regex_Repository) listed a recommended email regex that was itself vulnerable to ReDoS. And Kubeflow's email validation earned [CVE-2024-5552](https://nvd.nist.gov/vuln/detail/CVE-2024-5552) for the same reason. The email regex is a genre, and the genre is tragedy.`,
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'cursed',
    dangerLevel: 4,
    emoji: '🎭',
    explanation: `This is what happens when you try to encode a 47-page IETF specification into a single line of punctuation.

Before the @, the local part accepts two forms. The first is a dot-atom: letters, digits, and a wild assortment of special characters, separated by dots. The second is a quoted string enclosed in double quotes, which permits most printable ASCII bytes and control characters, with backslash escaping for the rest.

After the @, the domain is either a standard dotted hostname where each label starts and ends with an alphanumeric, or a bracketed IP literal with full octet-level validation. There's even a fallback path for general address literals.

Every group is non-capturing for performance. The whole thing still doesn't handle internationalized email addresses or header comments. Even the regex that tries hardest to follow the RFC doesn't quite get there.`,
    flags: 'i',
    id: 1,
    jsCompatible: true,
    regex: `(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])`,
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description:
          'Letters, digits, and a wild assortment of special characters. This is the "normal" part of an email address before the @.',
        label: 'Dot-atom characters',
        pattern: `[a-z0-9!#$%&'*+/=?^_\`{|}~-]+`,
      },
      {
        color: 'purple',
        description:
          'More of the same characters after a dot. Repeats zero or more times, allowing "user.name.here" format.',
        label: 'Dot-separated sections',
        pattern: `(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*`,
      },
      {
        color: 'pink',
        description:
          'The alternative local part format: a quoted string that permits most ASCII bytes and control characters with backslash escaping. Yes, "hello world"@example.com is technically valid.',
        label: 'Quoted string local part',
        pattern: `"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*"`,
      },
      {
        color: 'yellow',
        description: 'The @ sign. The one part of email validation everyone gets right.',
        label: '@ separator',
        pattern: '@',
      },
      {
        color: 'green',
        description:
          'Domain name labels: start and end with alphanumeric, hyphens allowed in the middle. Repeated with dots for subdomains.',
        label: 'DNS labels',
        pattern: '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+',
      },
      {
        color: 'cyan',
        description:
          'The final domain label (TLD). Same alphanumeric-boundary rule. Does NOT enforce the 63-character DNS label limit.',
        label: 'Top-level domain',
        pattern: '[a-z0-9](?:[a-z0-9-]*[a-z0-9])?',
      },
      {
        color: 'orange',
        description:
          'Validates a single IPv4 octet: 0-255. Three alternations handle the ranges 250-255, 200-249, and 0-199 respectively.',
        label: 'IP octet validation',
        pattern: '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      },
      {
        color: 'purple',
        description:
          'Fallback for non-IP address literals. Allows custom address types defined in future RFCs. A trapdoor for extensibility.',
        label: 'General address literal',
        pattern: '[a-z0-9-]*[a-z0-9]:',
      },
    ],
    subtitle: 'What happens when you encode a 47-page IETF spec into one line of punctuation.',
    testCases: [
      { input: 'user@example.com', label: 'user@example.com', shouldMatch: true },
      { input: 'user.name+tag@domain.co.uk', label: 'dotted + tag', shouldMatch: true },
      { input: 'user@[192.168.1.1]', label: 'IPv4 literal', shouldMatch: true },
      { input: 'not-an-email', label: 'no @ sign', shouldMatch: false },
      { input: '@missing-local.com', label: 'no local part', shouldMatch: false },
      { input: 'user@.invalid', label: 'leading dot domain', shouldMatch: false },
    ],
    title: 'RFC 5322 Email Validator',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. Catastrophic Backtracking
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content: `On July 2, 2019, a Cloudflare engineer deployed a WAF rule containing \`.*(?:.*=.*)\`, which is this same pattern in a trench coat. CPU hit 100% on every HTTP-serving core worldwide. Discord, Coinbase, and a huge slice of the internet went dark for 27 minutes. Cloudflare's [detailed postmortem](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/) is worth reading. One regex, one global outage, one engine migration.

The backstory goes deeper. In January 2007, Russ Cox at Google published ["Regular Expression Matching Can Be Simple And Fast,"](https://swtch.com/~rsc/regexp/regexp1.html) showing that Ken Thompson's 1968 NFA construction handles all regexes in O(mn) time with no pathological cases. Google open-sourced the resulting engine as [RE2](https://github.com/google/re2) in 2010. Cloudflare knew about RE2 before the outage. They just hadn't switched yet.`,
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'cursed',
    dangerLevel: 5,
    emoji: '⚡',
    explanation: `The outer group (a+)+ means "one or more a's, one or more times." Seems redundant, and for matching strings it is. But when the input almost matches and fails at the end (like "aaaaaaaaaaaaaaX"), the regex engine needs to prove no possible partition works before giving up.

How many ways can you split 15 a's into groups of one or more? It's O(2^n). For 20 a's followed by an X, the engine churns for seconds. For 30, minutes. For 40, you might as well go make coffee.

This is the canonical ReDoS (Regular Expression Denial of Service) attack. It works because most regex engines use backtracking instead of finite automata.`,
    id: 2,
    jsCompatible: true,
    jsRegex: '^(a+)+$',
    maxInputLength: 24,
    regex: '^(a+)+$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description: 'Anchors the match at the beginning of the string. Innocent enough.',
        label: 'Start anchor',
        pattern: '^',
      },
      {
        color: 'pink',
        description:
          'Captures one or more "a" characters. The inner quantifier creates the first dimension of matching possibilities.',
        label: "Inner group: one or more a's",
        pattern: '(a+)',
      },
      {
        color: 'yellow',
        description:
          "The outer + repeats the entire group one or more times. Combined with the inner a+, this creates the question: how many ways can you split N a's into groups? The answer is O(2^n).",
        label: 'Outer quantifier: one or more groups',
        pattern: '+',
      },
      {
        color: 'cyan',
        description:
          'Anchors at end of string. When the input has a trailing non-"a" character, the engine must prove NO possible partition works before giving up. That\'s where the exponential explosion happens.',
        label: 'End anchor',
        pattern: '$',
      },
    ],
    subtitle: 'Three characters that can freeze a computer.',
    testCases: [
      { input: 'aaaaaa', label: 'aaaaaa (matches)', shouldMatch: true },
      { input: 'a', label: 'single a', shouldMatch: true },
      { input: 'aaaaaX', label: 'aaaaaX (fast fail)', shouldMatch: false },
      { input: 'b', label: 'wrong character', shouldMatch: false },
    ],
    title: 'Catastrophic Backtracking',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. Double Backtracking Bomb
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content:
        'On July 20, 2016, [Stack Overflow went down for 34 minutes](https://stackstatus.tumblr.com/post/147710624694/outage-postmortem-july-20-2016). The culprit was `^[\\s\\u200c]+|[\\s\\u200c]+$`, a seemingly innocent regex meant to trim Unicode whitespace. A malformed post containing ~20,000 consecutive spaces triggered O(n\u00B2) backtracking. The post appeared on the homepage, so every homepage view triggered it, the health check failed, and the load balancer pulled all servers out of rotation. The regex was replaced with a substring function.',
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'cursed',
    dangerLevel: 5,
    emoji: '🔥',
    explanation: `The left branch ((a+)(b+))+ tries to match alternating groups of a's and b's. When it fails, the right branch ((a+)+(b+)?)+ gets its turn, and that one is worse: (a+)+ is the classic catastrophic pattern from entry #2, plus the optional (b+)? adds a third dimension of backtracking.

On input like "aaaaaaaaaaaaaaaaaac", the left branch can't match (no b to pair with the a's), so the engine exhausts it and falls into the right alternative's exponential hell. Two bombs detonating in sequence.`,
    id: 3,
    jsCompatible: true,
    jsRegex: '^((a+)(b+))+$|^((a+)+(b+)?)+$',
    maxInputLength: 20,
    regex: '^((a+)(b+))+$|^((a+)+(b+)?)+$',
    section: 'main',
    segments: [
      { color: 'cyan', description: 'Beginning of the left branch.', label: 'Start anchor (left)', pattern: '^' },
      {
        color: 'purple',
        description:
          "Tries to match alternating groups of a's and b's. When the input has no b's to pair with the a's, this branch fails, handing control to the right branch.",
        label: 'Alternating a/b groups',
        pattern: '((a+)(b+))+',
      },
      { color: 'cyan', description: 'End of the left branch.', label: 'End anchor (left)', pattern: '$' },
      {
        color: 'yellow',
        description: 'The pipe. When the left branch fails, the engine falls into the right branch.',
        label: 'Alternation',
        pattern: '|',
      },
      {
        color: 'cyan',
        description: 'Beginning of the right branch. The bomb is armed.',
        label: 'Start anchor (right)',
        pattern: '^',
      },
      {
        color: 'pink',
        description: 'The same (a+)+ from entry #2. Exponential backtracking on its own.',
        label: 'Classic catastrophic pattern',
        pattern: '(a+)+',
      },
      {
        color: 'orange',
        description:
          "An optional group of b's adds a third dimension of backtracking possibilities. The ? means the engine tries with AND without it at every position.",
        label: 'Optional b group',
        pattern: '(b+)?',
      },
      {
        color: 'cyan',
        description:
          'Must reach end of string. On input like "aaaaaaaaac", the left branch fails (no b\'s), and the right branch\'s exponential hell begins.',
        label: 'End anchor (right)',
        pattern: '$',
      },
    ],
    subtitle: 'Two exponential traps joined by a pipe.',
    testCases: [
      { input: 'aaabbb', label: 'aaabbb', shouldMatch: true },
      { input: 'aabbab', label: 'aabbab', shouldMatch: true },
      { input: 'aaaa', label: 'aaaa (right branch)', shouldMatch: true },
      { input: 'abc', label: 'abc (has c)', shouldMatch: false },
    ],
    title: 'Double Backtracking Bomb',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. URL Validator
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'cursed',
    dangerLevel: 4,
    emoji: '🎪',
    explanation: `Here's the layer cake. The protocol matches http/https/ftp. An optional user:password@ handles auth. Then three negative lookaheads reject non-public IPs: RFC 1918 private ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x), plus the loopback block (127.x.x.x) and the link-local range (169.254.x.x).

After the gauntlet, it matches either a public IPv4 address with octet validation or an internationalized domain name using Unicode ranges. Port and path trail at the end.

Someone wrote IP range validation as nested numeric alternations inside zero-width assertions. That someone was having a bad day and chose to share it with everyone who maintains this code after them.`,
    flags: 'i',
    id: 4,
    jsCompatible: true,
    regex:
      '^(?:(?:https?|ftp):\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description: 'Matches http://, https://, or ftp://. The s? makes HTTPS optional. Standard stuff.',
        label: 'Protocol',
        pattern: '(?:https?|ftp):\\/\\/',
      },
      {
        color: 'purple',
        description:
          'Optional user:password@ authentication. \\S+ matches any non-whitespace for the username, :password is optional.',
        label: 'Auth credentials',
        pattern: '(?:\\S+(?::\\S*)?@)?',
      },
      {
        color: 'pink',
        description:
          'Negative lookahead: rejects RFC 1918 private (10.0.0.0/8) and loopback (127.0.0.0/8) addresses. IP range validation as nested numeric alternations inside zero-width assertions.',
        label: 'Reject 10.x.x.x / 127.x.x.x',
        pattern: '(?!(?:10|127)(?:\\.\\d{1,3}){3})',
      },
      {
        color: 'pink',
        description: 'Another negative lookahead: rejects link-local (169.254.x.x) and private (192.168.x.x) ranges.',
        label: 'Reject link-local / 192.168',
        pattern: '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})',
      },
      {
        color: 'pink',
        description:
          'Yet another negative lookahead for the 172.16.0.0/12 private range. Three numeric alternations to express "16 through 31."',
        label: 'Reject 172.16-31.x.x',
        pattern: '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})',
      },
      {
        color: 'green',
        description:
          'After the gauntlet of rejections, validates the first octet of a public IPv4 address: 1-223, excluding private ranges.',
        label: 'First octet (public)',
        pattern: '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])',
      },
      {
        color: 'orange',
        description:
          'Domain name labels with Unicode support (\\u00a1-\\uffff). Handles internationalized domain names like "münchen.de".',
        label: 'Internationalized domain labels',
        pattern: '(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.',
      },
      {
        color: 'yellow',
        description:
          'Optional port: 2-5 digits. Allows ports 10-99999, which includes some invalid port numbers (>65535). Close enough.',
        label: 'Port number',
        pattern: '(?::\\d{2,5})?',
      },
      {
        color: 'cyan',
        description:
          'Optional path, query string, or fragment. Matches anything starting with /, ?, or # followed by non-whitespace.',
        label: 'Path / query / fragment',
        pattern: '(?:[/?#]\\S*)?',
      },
    ],
    subtitle: 'It rejects private IP addresses inside a regex using negative lookaheads on numeric ranges.',
    testCases: [
      { input: 'https://example.com', label: 'https://example.com', shouldMatch: true },
      { input: 'http://sub.domain.co.uk/path?q=1', label: 'full URL', shouldMatch: true },
      { input: 'http://8.8.8.8/dns-query', label: 'public IPv4', shouldMatch: true },
      { input: 'not-a-url', label: 'no protocol', shouldMatch: false },
      { input: 'http://192.168.1.1', label: 'private IP rejected', shouldMatch: false },
    ],
    title: 'URL Validator',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. ISO 8601 Datetime + Duration
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content:
        'The JavaScript library [moment.js](https://momentjs.com/) used regexes extensively for date parsing, and it showed. [CVE-2016-4055](https://nvd.nist.gov/vuln/detail/CVE-2016-4055) hit `duration()` with ReDoS. [CVE-2022-31129](https://nvd.nist.gov/vuln/detail/CVE-2022-31129) nailed `preprocessRFC2822` with the same thing. Moment was one of the most-downloaded npm packages on the planet, so both CVEs had enormous blast radius. The library is now in maintenance mode, and its own docs tell you not to use it for new projects.',
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'clever',
    dangerLevel: 3,
    emoji: '🌙',
    explanation: `The datetime branch validates year, month (01-12), and day (01-31). After the T separator, hours go 00-23, minutes 00-59, and seconds 00-60 because leap seconds are a real thing that ISO 8601 accommodates. Fractional seconds and timezone offsets round it out.

The duration branch starts with P and chains optional year/month/week/day/hour/minute/second components. Each one is individually optional, but the structure enforces at least the P prefix.

The eternal shame: it happily validates February 31st. It also matches P alone (a bare duration with no components, invalid per the spec), and a date with T but no time after it. Date regexes that try to handle month-day dependencies become roughly ten times longer and still can't handle leap years correctly. At some point you accept the L and validate in application code.`,
    id: 5,
    jsCompatible: true,
    jsRegex:
      '^(?:(?:(?:\\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01]))T(?:(?:[01]\\d|2[0-3]):(?:[0-5]\\d):(?:[0-5]\\d|60)(?:\\.\\d+)?)?(?:Z|[+-](?:[01]\\d|2[0-3]):(?:[0-5]\\d))?|P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?)$',
    regex:
      '^(?:(?:(?:\\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01]))T(?:(?:[01]\\d|2[0-3]):(?:[0-5]\\d):(?:[0-5]\\d|60)(?:\\.\\d+)?)?(?:Z|[+-](?:[01]\\d|2[0-3]):(?:[0-5]\\d))?|P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?)$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description: 'Four digits for the year. No range validation — year 9999 is fine, year 0000 is also fine.',
        label: 'Year',
        pattern: '\\d{4}',
      },
      {
        color: 'green',
        description: 'Two-digit month: 01-09 or 10-12. Clean and correct.',
        label: 'Month (01-12)',
        pattern: '0[1-9]|1[0-2]',
      },
      {
        color: 'green',
        description: 'Two-digit day: 01-09, 10-29, or 30-31. The eternal shame: it happily validates February 31st.',
        label: 'Day (01-31)',
        pattern: '0[1-9]|[12]\\d|3[01]',
      },
      {
        color: 'yellow',
        description: 'The T between date and time portions. Required by the spec.',
        label: 'Date-time separator',
        pattern: 'T',
      },
      {
        color: 'purple',
        description: '24-hour format: 00-19 or 20-23.',
        label: 'Hours (00-23)',
        pattern: '[01]\\d|2[0-3]',
      },
      {
        color: 'purple',
        description: 'Seconds go up to 60, not 59 — because leap seconds are a real thing that ISO 8601 accommodates.',
        label: 'Seconds (00-60)',
        pattern: '[0-5]\\d|60',
      },
      {
        color: 'orange',
        description:
          'Z for UTC, or a +/- offset with hour:minute validation. Handles everything from UTC-12 to UTC+14.',
        label: 'Timezone offset',
        pattern: 'Z|[+-](?:[01]\\d|2[0-3]):(?:[0-5]\\d)',
      },
      {
        color: 'pink',
        description:
          'Duration branch starting with P, followed by optional years, months, weeks, days. Each individually optional, but at least the P prefix is enforced.',
        label: 'Duration date components',
        pattern: 'P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?',
      },
      {
        color: 'pink',
        description:
          'Time portion of the duration: hours, minutes, seconds (with optional fractional). P alone with no components still matches — invalid per spec.',
        label: 'Duration time components',
        pattern: 'T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?',
      },
    ],
    subtitle: 'Both datetimes and durations in one pattern — the ISO 8601 equivalent of a mullet.',
    testCases: [
      { input: '2024-01-15T10:30:00Z', label: 'UTC datetime', shouldMatch: true },
      { input: '2024-02-31T00:00:00Z', label: 'Feb 31 (oops)', shouldMatch: true },
      { input: '2024-01-15T', label: 'date + bare T (oops)', shouldMatch: true },
      { input: 'P1Y2M3DT4H5M6S', label: 'full duration', shouldMatch: true },
      { input: 'P', label: 'P alone (oops)', shouldMatch: true },
      { input: '2024-13-01T00:00:00Z', label: 'month 13', shouldMatch: false },
      { input: 'not-a-date', label: 'not a date', shouldMatch: false },
    ],
    title: 'ISO 8601 Datetime + Duration',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. HTML Tag Matcher
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content: `On November 13, 2009, a Stack Overflow user asked "RegEx match open tags except XHTML self-contained tags." User bobince replied with what became [the most legendary answer in the site's history](https://stackoverflow.com/a/1732454). It begins "You can't parse [X]HTML with regex" and escalates into full Lovecraftian horror, warning that attempting to do so will summon Zalgo. The answer has over 4,000 upvotes and was locked for historical preservation. Jeff Atwood wrote it up as ["Parsing Html The Cthulhu Way."](https://blog.codinghorror.com/parsing-html-the-cthulhu-way/) The core technical point: HTML is not a regular language — regular expressions are provably insufficient to parse it. People still try.`,
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'cursed',
    dangerLevel: 5,
    emoji: '💀',
    explanation: `The attribute handling tries three paths: double-quoted values, single-quoted values, and bare characters. The trailing quote absorber after quoted strings is a red flag. A negative lookbehind prevents self-closing tags from entering the content-matching branch.

The content matcher references \\1 to stop at the matching close tag, but the pattern uses only non-capturing groups, so \\1 is actually an invalid backreference in most engines. The whole tag-name-matching strategy is fundamentally broken.

It fails on nested identical tags. It exists as a monument to the gap between "this almost works" and "this actually works," which in HTML parsing is the width of the Grand Canyon.`,
    id: 6,
    jsCompatible: true,
    jsRegex: `<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+\\s*/?>`,
    regex: `<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+(?<!/)\\s*>(?:(?!<\\1[\\s>])[\\s\\S])*?<\\/\\1>|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+\\s*/?>`,
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description: 'The start of an HTML tag. Simple enough. Everything after this is where the suffering begins.',
        label: 'Opening angle bracket',
        pattern: '<',
      },
      {
        color: 'green',
        description:
          'Matches double-quoted attribute values. The trailing [\'"]* absorbs stray quotes — already a red flag.',
        label: 'Double-quoted attribute',
        pattern: `"[^"]*"['"]*`,
      },
      {
        color: 'green',
        description: 'Same for single-quoted values. The stray-quote absorber appears again.',
        label: 'Single-quoted attribute',
        pattern: `'[^']*'['"]*`,
      },
      {
        color: 'purple',
        description:
          'Non-quote, non-angle-bracket characters. Handles unquoted attributes, but unquoted attributes with > still break it.',
        label: 'Bare attribute content',
        pattern: `[^'">]`,
      },
      {
        color: 'pink',
        description:
          'Negative lookbehind prevents self-closing tags (like <br />) from entering the content-matching branch.',
        label: 'Not self-closing (lookbehind)',
        pattern: '(?<!/)',
      },
      {
        color: 'orange',
        description:
          'Matches tag content lazily, stopping at the "matching" close tag. But \\1 references a non-capturing group — this backreference is broken in most engines.',
        label: 'Content between tags',
        pattern: '(?:(?!<\\1[\\s>])[\\s\\S])*?',
      },
      {
        color: 'pink',
        description:
          'The close tag using backreference \\1. Since all groups are non-capturing, \\1 is actually an invalid backreference or gets interpreted as an octal escape. The whole tag-matching strategy is fundamentally broken.',
        label: 'Closing tag (broken)',
        pattern: '<\\/\\1>',
      },
      {
        color: 'yellow',
        description:
          'The second branch handles self-closing tags: optional whitespace, optional slash, closing bracket.',
        label: 'Self-closing fallback',
        pattern: '\\s*/?>',
      },
    ],
    subtitle: 'The physical manifestation of "you can\'t parse HTML with regex."',
    testCases: [
      { input: '<div>hello</div>', label: 'paired tag (broken)', shouldMatch: false },
      { input: '<br />', label: 'self-closing', shouldMatch: true },
      { input: '<img src="x.jpg" />', label: 'img tag', shouldMatch: true },
      { input: 'just text', label: 'no tags', shouldMatch: false },
    ],
    title: 'HTML Tag Matcher',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. Password Validator
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'cursed',
    dangerLevel: 4,
    emoji: '🩸',
    explanation: `Six zero-width assertions fire at position zero before any character is consumed: lowercase, uppercase, digit, special character, non-ASCII, no triple-repeats, and no common sequences. Then .{16,} demands at least 16 characters.

The non-ASCII requirement is the twist of the knife. Combined with the banned-substring check and the no-repeats rule, this password policy would drive users to write P@ssw0rd_Séçür3🔥 on a sticky note attached to their monitor. The regex technically improves password entropy while practically destroying password security. A beautiful paradox.`,
    id: 7,
    jsCompatible: true,
    jsRegex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?])(?=.*[^\\x00-\\x7F])(?!.*(.)\\1{2})(?!.*(?:123|abc|qwerty|password)).{16,}$`,
    regex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?])(?=.*[^\\x00-\\x7F])(?!.*(.)\\1{2})(?!.*(?:123|abc|qwerty|password)).{16,}$`,
    section: 'main',
    segments: [
      {
        color: 'green',
        description:
          'Lookahead: at least one lowercase letter must exist somewhere in the string. Checked at position zero without consuming characters.',
        label: 'Requires lowercase',
        pattern: '(?=.*[a-z])',
      },
      {
        color: 'green',
        description:
          'Lookahead: at least one uppercase letter. Six zero-width assertions fire at position zero before any character is consumed.',
        label: 'Requires uppercase',
        pattern: '(?=.*[A-Z])',
      },
      {
        color: 'green',
        description: 'Lookahead: at least one digit (0-9).',
        label: 'Requires digit',
        pattern: '(?=.*\\d)',
      },
      {
        color: 'purple',
        description: 'Lookahead: at least one special character from a comprehensive set of punctuation.',
        label: 'Requires special character',
        pattern: `(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?])`,
      },
      {
        color: 'pink',
        description:
          'The twist of the knife. Your password must contain a non-ASCII character — an emoji, accented letter, or CJK character. This technically improves entropy while practically guaranteeing a sticky note.',
        label: 'Requires non-ASCII (!)',
        pattern: '(?=.*[^\\x00-\\x7F])',
      },
      {
        color: 'orange',
        description:
          'Negative lookahead: no character may appear three times in a row. Catches "aaa" anywhere in the string. The backreference \\1 compares against the captured character.',
        label: 'No triple repeats',
        pattern: '(?!.*(.)\\1{2})',
      },
      {
        color: 'orange',
        description:
          "Negative lookahead: rejects strings containing common substrings. A blocklist that's comically easy to circumvent.",
        label: 'No common sequences',
        pattern: '(?!.*(?:123|abc|qwerty|password))',
      },
      {
        color: 'yellow',
        description:
          'After all six lookaheads pass, consume at least 16 characters of anything. The actual matching part of this regex is almost an afterthought.',
        label: 'Minimum 16 characters',
        pattern: '.{16,}',
      },
    ],
    subtitle: 'It requires a non-ASCII character in your password. Your password literally needs an emoji.',
    testCases: [
      { input: 'P@ssw0rd_Séçür3🔥', label: 'P@ssw0rd_Séçür3🔥', shouldMatch: true },
      { input: 'SimplePassword1!', label: 'no non-ASCII', shouldMatch: false },
      { input: 'Sh0rt!é', label: 'too short', shouldMatch: false },
      { input: 'AAA_Séçür3_Test1!xx', label: 'triple AAA', shouldMatch: false },
    ],
    title: 'Password Validator',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8. JSON Number
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'clever',
    dangerLevel: 1,
    emoji: '💎',
    explanation: `It follows [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) to the letter. Optional minus (no + prefix, because JSON said so). Integer part is either exactly 0 or a non-zero digit followed by more digits, which means no leading zeros like 007. Optional decimal point requiring at least one trailing digit. Optional exponent with case-insensitive E and optional sign.

The terror here is quiet. This is a perfectly correct, well-behaved regex. Someone will copy-paste it into a financial transaction validator running in production, and it will dutifully validate -0.0 as a legal number, because it is. According to the spec. Technically.`,
    id: 8,
    jsCompatible: true,
    jsRegex: '^-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?$',
    regex: '^-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?$',
    section: 'main',
    segments: [
      { color: 'cyan', description: 'Beginning of string.', label: 'Start anchor', pattern: '^' },
      {
        color: 'yellow',
        description: "Optional negative sign. No + prefix allowed, because JSON said so. That's the spec.",
        label: 'Optional minus',
        pattern: '-?',
      },
      {
        color: 'green',
        description:
          'Either exactly 0 or a non-zero digit followed by more digits. No leading zeros like 007. This single rule is why the regex exists at all.',
        label: 'Integer part',
        pattern: '0|[1-9]\\d*',
      },
      {
        color: 'purple',
        description:
          'Optional decimal point requiring at least one trailing digit. ".5" alone is not valid JSON; "0.5" is.',
        label: 'Decimal part',
        pattern: '(?:\\.\\d+)?',
      },
      {
        color: 'orange',
        description:
          'Optional scientific notation. Case-insensitive E with optional sign. 1e10, 1E-3, 1.5e+2 all work.',
        label: 'Exponent',
        pattern: '(?:[eE][+-]?\\d+)?',
      },
      {
        color: 'cyan',
        description:
          'End of string. The terror here is quiet: this will dutifully validate -0.0 as legal, because it is. According to the spec. Technically.',
        label: 'End anchor',
        pattern: '$',
      },
    ],
    subtitle: "Actually correct. And that's what makes it scary.",
    testCases: [
      { input: '42', label: '42', shouldMatch: true },
      { input: '-0.0', label: '-0.0 (legal!)', shouldMatch: true },
      { input: '1.5e10', label: '1.5e10', shouldMatch: true },
      { input: '007', label: '007 (leading zero)', shouldMatch: false },
      { input: '+1', label: '+1 (no plus)', shouldMatch: false },
      { input: '.5', label: '.5 (needs 0.)', shouldMatch: false },
    ],
    title: 'JSON Number',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. CSS Color Matcher
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'clever',
    dangerLevel: 2,
    emoji: '🌈',
    explanation: `Five branches: hex codes via the {3}{1,2} trick with optional alpha pair, legacy comma-separated rgb()/hsl(), modern space-separated CSS Color Level 4 syntax with / alpha, named colors using prefix groups, and the transparent keyword.

The hex branch has a subtle bug. The {3}{1,2} matches 3 or 6, and the trailing optional pair gives lengths 3, 5, 6, and 8. But 5-digit hex isn't a valid CSS color, so #abcde incorrectly matches while #abcd (the valid 4-digit shorthand with alpha) doesn't.

The named color section is the neat part. Instead of listing all 148 CSS named colors, it groups them by suffix and makes the prefix optional. It only covers a subset, though. The full list would quadruple the regex length, and at that point you'd be staring at the abyss in papayawhip.`,
    flags: 'i',
    id: 9,
    jsCompatible: true,
    jsRegex:
      '^(?:#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?|(?:rgb|hsl)a?\\(\\s*(?:\\d{1,3}%?\\s*,\\s*){2}\\d{1,3}%?\\s*(?:,\\s*(?:0?\\.\\d+|\\d(?:\\.\\d+)?))?\\s*\\)|(?:alice|cadet|cornflower|dark|deep|dodger|light|medium|midnight|powder|royal|sky|slate|steel)?blue|transparent)$',
    regex:
      '^(?:#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?|(?:rgb|hsl)a?\\(\\s*(?:\\d{1,3}%?\\s*,\\s*){2}\\d{1,3}%?\\s*(?:,\\s*(?:0?\\.\\d+|\\d(?:\\.\\d+)?))?\\s*\\)|(?:rgb|hsl)a?\\(\\s*(?:\\d{1,3}%?\\s+){2}\\d{1,3}%?\\s*(?:\\/\\s*(?:0?\\.\\d+|\\d{1,3}%))?\\s*\\)|(?:alice|cadet|cornflower|dark|deep|dodger|light|medium|midnight|powder|royal|sky|slate|steel)?blue|transparent)$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description:
          'Matches #RGB or #RRGGBB. The {3}{1,2} trick matches 3 or 6 hex characters. Elegant but has a subtle bug with the alpha extension.',
        label: 'Hex color (3 or 6 digits)',
        pattern: '#(?:[0-9a-fA-F]{3}){1,2}',
      },
      {
        color: 'purple',
        description:
          "Adds optional 2-digit alpha. Combined with the 3-or-6 base, this allows lengths 3, 5, 6, and 8 — but 5-digit hex isn't valid CSS. A bug.",
        label: 'Optional hex alpha',
        pattern: '(?:[0-9a-fA-F]{2})?',
      },
      {
        color: 'green',
        description: 'Matches rgb(), rgba(), hsl(), or hsla(). The a? makes the alpha suffix optional for both.',
        label: 'Function name',
        pattern: '(?:rgb|hsl)a?\\(',
      },
      {
        color: 'orange',
        description:
          'Three numeric values separated by commas, each optionally a percentage. The legacy CSS color syntax.',
        label: 'Legacy comma-separated values',
        pattern: '(?:\\d{1,3}%?\\s*,\\s*){2}\\d{1,3}%?',
      },
      {
        color: 'orange',
        description: 'CSS Color Level 4 syntax: values separated by spaces instead of commas. The modern way.',
        label: 'Modern space-separated values',
        pattern: '(?:\\d{1,3}%?\\s+){2}\\d{1,3}%?',
      },
      {
        color: 'pink',
        description:
          'Instead of listing all 148 named colors, this groups them by suffix. "blue", "aliceblue", "royalblue" all match one branch. Clever compression — but only covers a subset.',
        label: 'Named colors (blue family)',
        pattern: '(?:alice|cadet|cornflower|dark|deep|dodger|light|medium|midnight|powder|royal|sky|slate|steel)?blue',
      },
      {
        color: 'yellow',
        description: "The transparent keyword. Everyone forgets it's technically a color value.",
        label: 'Transparent keyword',
        pattern: 'transparent',
      },
    ],
    subtitle: 'Four generations of CSS color syntax in one pattern.',
    testCases: [
      { input: '#ff00ff', label: '#ff00ff', shouldMatch: true },
      { input: '#fff', label: '#fff', shouldMatch: true },
      { input: '#abcde', label: '5-digit hex bug', shouldMatch: true },
      { input: '#abcd', label: 'valid CSS, regex misses', shouldMatch: false },
      { input: 'rgb(255, 0, 128)', label: 'rgb()', shouldMatch: true },
      { input: 'royalblue', label: 'named color', shouldMatch: true },
      { input: 'transparent', label: 'transparent', shouldMatch: true },
      { input: 'notacolor', label: 'not a color', shouldMatch: false },
    ],
    title: 'CSS Color Matcher',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 10. The Leviathan: IPv6
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'cursed',
    dangerLevel: 4,
    emoji: '🌊',
    explanation: `IPv6 is 8 groups of 4 hex digits separated by colons, but the :: shorthand collapses consecutive zero-groups. The problem is that :: can appear at the beginning, middle, or end, absorbing anywhere from 1 to 7 groups.

Regex can't count how many groups are on each side of :: and verify the total is 8, so this pattern brute-forces it: one branch for each valid split point. Seven branches handle :: in progressively different positions.

Then there are special cases: fe80: link-local addresses with zone IDs (%eth0), ::ffff: IPv4-mapped addresses with embedded dotted-decimal notation, and the fully-compressed :: for all-zeros. The set of valid IPv6 representations is technically a regular language, so a regex can match it. But the brute-force enumeration is the price you pay for a constraint that's trivial to check in code.`,
    flags: 'i',
    id: 10,
    jsCompatible: true,
    jsRegex:
      '^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9]))$',
    regex:
      '^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9]))$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description:
          'The basic case: eight groups of 1-4 hex digits separated by colons. No :: compression. Like 2001:0db8:85a3:0000:0000:8a2e:0370:7334.',
        label: 'Full 8-group form',
        pattern: '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}',
      },
      {
        color: 'purple',
        description:
          'One to seven groups followed by a trailing colon — the :: is at the end, compressing trailing zero groups.',
        label: ':: at end',
        pattern: '(?:[0-9a-fA-F]{1,4}:){1,7}:',
      },
      {
        color: 'green',
        description: 'One to six groups, then :: absorbs some zeros, then one more group at the end.',
        label: ':: with 1 group after',
        pattern: '(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}',
      },
      {
        color: 'green',
        description:
          'The enumeration continues: each branch handles a different split point for where :: appears. The left side has fewer groups, the right side has more.',
        label: ':: with 2 groups after',
        pattern: '(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}',
      },
      {
        color: 'purple',
        description: 'Handles :: at the beginning of the address, including :: alone (the all-zeros address).',
        label: ':: at start',
        pattern: ':(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)',
      },
      {
        color: 'orange',
        description:
          'Special case for fe80:: link-local addresses with a zone identifier like %eth0. The zone ID is required for link-local scope.',
        label: 'Link-local with zone ID',
        pattern: 'fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+',
      },
      {
        color: 'pink',
        description:
          'Handles ::ffff: IPv4-mapped addresses with embedded dotted-decimal notation and full octet validation (0-255).',
        label: 'IPv4-mapped addresses',
        pattern:
          '::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])',
      },
    ],
    subtitle: 'An address format with 8 groups and one shorthand rule requires twelve alternatives.',
    testCases: [
      { input: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', label: 'full address', shouldMatch: true },
      { input: '::1', label: 'loopback', shouldMatch: true },
      { input: '::', label: 'all zeros', shouldMatch: true },
      { input: '::ffff:192.168.1.1', label: 'IPv4-mapped', shouldMatch: true },
      { input: 'not:an:ipv6', label: 'too few groups', shouldMatch: false },
    ],
    title: 'The Leviathan: IPv6',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 11. Semantic Versioning
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'clever',
    dangerLevel: 2,
    emoji: '🎯',
    explanation: `Each version component is 0|[1-9]\\d* instead of \\d+, which means 1.02.3 is invalid per the spec. Most people don't know this. Pre-release identifiers after the - follow the same rule for numeric components (1.0.0-01 is invalid because 01 has a leading zero), but alphanumeric identifiers like 1.0.0-0a1 get a pass since they're compared lexically, not numerically.

Build metadata after + has no leading-zero restriction at all because it carries no precedence semantics. Without the leading-zero rule this would just be \\d+\\.\\d+\\.\\d+ with some optional suffixes. The spec's insistence on canonical numeric representation is what forces 0|[1-9]\\d* to appear six times.`,
    id: 11,
    jsCompatible: true,
    jsRegex:
      '^(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?$',
    regex:
      '^(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description:
          'Either 0 or a non-zero digit followed by more digits. No leading zeros: "1.02.3" is invalid per spec. This rule appears six times.',
        label: 'Major version',
        pattern: '(?:0|[1-9]\\d*)',
      },
      {
        color: 'yellow',
        description: 'Literal dot between version components.',
        label: 'Dot separator',
        pattern: '\\.',
      },
      {
        color: 'green',
        description: 'Same no-leading-zeros rule for the minor version.',
        label: 'Minor version',
        pattern: '(?:0|[1-9]\\d*)',
      },
      {
        color: 'purple',
        description: 'And again for the patch version.',
        label: 'Patch version',
        pattern: '(?:0|[1-9]\\d*)',
      },
      {
        color: 'pink',
        description:
          'Optional pre-release section after -. Numeric identifiers follow the no-leading-zeros rule, but alphanumeric identifiers (like "0a1") get a pass since they\'re compared lexically, not numerically.',
        label: 'Pre-release identifiers',
        pattern: '(?:-(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?',
      },
      {
        color: 'orange',
        description:
          'Optional build metadata after +. No leading-zero restriction at all because build metadata carries no precedence semantics.',
        label: 'Build metadata',
        pattern: '(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?',
      },
    ],
    subtitle: 'The leading-zero prohibition is where all the complexity hides.',
    testCases: [
      { input: '1.2.3', label: '1.2.3', shouldMatch: true },
      { input: '1.0.0-alpha.1', label: 'pre-release', shouldMatch: true },
      { input: '1.0.0+build.123', label: 'build metadata', shouldMatch: true },
      { input: '1.02.3', label: '1.02.3 (leading zero)', shouldMatch: false },
      { input: '1.0.0-01', label: 'pre-release leading zero', shouldMatch: false },
    ],
    title: 'Semantic Versioning',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 12. The Forbidden One: Balanced Parentheses
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content: `Philip Hazel created [PCRE](https://www.pcre.org/) in 1997 at the University of Cambridge, originally for the [Exim](https://www.exim.org/) mail transfer agent. Recursive pattern support landed in PCRE 3.0 in February 2000. Perl itself didn't add recursion until version 5.10 in December 2007, meaning PCRE beat its own namesake language by seven years. The "Perl Compatible" library was ahead of Perl. Beautiful irony.`,
      emoji: '🔮',
      label: 'Origin story',
    },
    category: 'awesome',
    dangerLevel: 3,
    emoji: '🪄',
    explanation: `(?R) is PCRE's recursive subpattern. It re-invokes the entire pattern at the current position, including the anchors. This is the critical subtlety: because the anchors are part of the recursion, deeply nested inputs can fail in some engines.

Despite the quirk, the concept is genuinely wild. This recognizes a context-free language, which is theoretically impossible for true regular expressions. The Chomsky hierarchy says regular grammars sit strictly below context-free grammars. PCRE's (?R) extension punches through that ceiling by adding a call stack to the matcher, making it equivalent to a pushdown automaton.

Works in PCRE (PHP, R) and Perl. JavaScript, Python's re, Rust's regex, and Go's regexp don't support recursion at all.`,
    id: 12,
    jsCompatible: true,
    jsRegex: '\\((?:[^()]*|\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\))*\\)',
    regex: '^\\((?:[^()]*|(?R))*\\)$',
    section: 'main',
    segments: [
      {
        color: 'cyan',
        description: 'Must match from the beginning of the string.',
        label: 'Start anchor',
        pattern: '^',
      },
      {
        color: 'yellow',
        description: 'Literal opening paren. The match starts here.',
        label: 'Opening parenthesis',
        pattern: '\\(',
      },
      {
        color: 'green',
        description: 'Matches any characters that aren\'t parentheses. The "base content" between balanced parens.',
        label: 'Non-paren characters',
        pattern: '[^()]*',
      },
      {
        color: 'pink',
        description:
          "PCRE's recursive subpattern. Re-invokes the ENTIRE pattern at the current position. This is the wild part — it makes the regex equivalent to a pushdown automaton, punching through the Chomsky hierarchy ceiling.",
        label: 'Recursive self-call (!)',
        pattern: '(?R)',
      },
      {
        color: 'yellow',
        description: 'Literal closing paren. Must balance the opening one at this recursion depth.',
        label: 'Closing parenthesis',
        pattern: '\\)',
      },
      {
        color: 'cyan',
        description:
          'Must reach end of string. The anchors are part of the recursion, which is a subtlety — deeply nested inputs can fail in some engines where the recursive call insists on matching full-string anchors at an interior position.',
        label: 'End anchor',
        pattern: '$',
      },
    ],
    subtitle: 'A regex doing something regexes are mathematically supposed to be incapable of.',
    testCases: [
      { input: '(hello)', label: '(hello)', shouldMatch: true },
      { input: '(a(b(c)d)e)', label: 'nested', shouldMatch: true },
      { input: '((()))', label: 'deep nesting', shouldMatch: true },
      { input: '(unbalanced', label: 'unbalanced', shouldMatch: false },
      { input: 'no parens', label: 'no parens', shouldMatch: false },
    ],
    title: 'The Forbidden One: Balanced Parentheses',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // THE CURSED APPENDIX
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 13. Prime Number Detector
  {
    bodyCount: {
      content: `Invented by [Abigail](https://metacpan.org/author/ABIGAIL), a legendary Perl hacker, who posted it to \`comp.lang.perl.misc\` around 1998. The canonical one-liner: \`perl -E 'say "Prime" if (1 x shift) !~ /^1?$|^(11+?)\\1+$/'\`. It became one of the most famous regex tricks in existence and is still used as a teaching example for how backreferences can simulate computation. The complexity is O(n\u00B2) in the worst case.`,
      emoji: '🔮',
      label: 'Origin story',
    },
    category: 'awesome',
    dangerLevel: 2,
    emoji: '🔮',
    explanation: `This matches composite (non-prime) numbers represented in unary, where the number N is a string of N 1's. Negate the match result to detect primes.

The first branch catches 0 and 1 (neither prime). The second branch captures a group of 2+ characters, then tries to fill the rest of the string with exact copies. If it can, the string length is divisible by the group length, so the number is composite.

For input "1111111" (7), the engine tries factor 2 — can "11" tile the remaining 5? No. Tries factor 3 — can "111" tile 4? No. Keeps going. None work. The match fails, meaning 7 is prime. A regex engine doing trial division through brute-force backtracking.`,
    id: 13,
    jsCompatible: true,
    jsRegex: '^1?$|^(11+?)\\1+$',
    regex: '^1?$|^(11+?)\\1+$',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description:
          'Matches empty string (0) or a single "1" (1). Neither is prime. This branch handles the edge cases.',
        label: 'Base case: 0 or 1',
        pattern: '^1?$',
      },
      {
        color: 'yellow',
        description: "If the base case doesn't match, try the composite-number detector.",
        label: 'Alternation',
        pattern: '|',
      },
      {
        color: 'cyan',
        description: 'Beginning of the composite-detection branch.',
        label: 'Start anchor',
        pattern: '^',
      },
      {
        color: 'pink',
        description:
          'Captures 2 or more 1\'s as a "factor." The +? makes it lazy so it tries small factors first (sensible, since small factors are more common).',
        label: 'Capture a potential factor',
        pattern: '(11+?)',
      },
      {
        color: 'green',
        description:
          'Tries to fill the remaining string with exact copies of the captured group. If it can, the string length is divisible by the group length — the number is composite.',
        label: 'Tile the rest with copies',
        pattern: '\\1+',
      },
      {
        color: 'cyan',
        description:
          'Must reach end of string. If no factor tiles the string evenly, the match fails, meaning the number is prime. Negate the match result to detect primes.',
        label: 'End anchor',
        pattern: '$',
      },
    ],
    subtitle: 'A regex that does arithmetic. Through backtracking. On purpose.',
    testCases: [
      { input: '1111111', label: '7 (prime)', shouldMatch: false },
      { input: '111111', label: '6 (composite)', shouldMatch: true },
      { input: '11', label: '2 (prime)', shouldMatch: false },
      { input: '1111', label: '4 (composite)', shouldMatch: true },
      { input: '1', label: '1 (not prime)', shouldMatch: true },
    ],
    title: 'Prime Number Detector',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 14. Palindrome Matcher
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'awesome',
    dangerLevel: 3,
    emoji: '🦋',
    explanation: `As the engine consumes characters from the front of the string, capture group \\1 grabs each character, and a lookahead peeks at the end of the string to build up the expected reversed suffix in \\2. The conditional (?(2)\\2) appends to the suffix if it already exists, or starts fresh. The *+ possessive quantifier prevents backtracking from undoing the buildup.

After consuming the first half, .? skips the optional middle character (for odd-length strings), and \\2? matches the accumulated reversed suffix.

This is a regex simulating a two-pointer traversal through lookaheads and self-referential capture groups. Technically impressive. Categorically the wrong tool.`,
    id: 14,
    jsCompatible: false,
    jsValidator: (input: string) => {
      const chars = Array.from(input)
      return chars.length > 0 && input === chars.reverse().join('')
    },
    regex: '^(?:(?:(.)(?=.*(\\1(?(2)\\2))$)))*+.?\\2?$',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description:
          'Captures each character from the front of the string as \\1, one at a time as the engine advances.',
        label: 'Capture current character',
        pattern: '(.)',
      },
      {
        color: 'pink',
        description:
          'Peeks at the end of the string. The conditional (?(2)\\2) appends to the suffix in \\2 if it already exists, or starts fresh. This incrementally builds the expected reversed ending.',
        label: 'Lookahead: build reversed suffix',
        pattern: '(?=.*(\\1(?(2)\\2))$)',
      },
      {
        color: 'yellow',
        description:
          'The *+ prevents backtracking from undoing the character-by-character buildup. Without possessive mode, the engine could unravel the partial palindrome check.',
        label: 'Possessive quantifier',
        pattern: '*+',
      },
      {
        color: 'green',
        description: 'Skips the optional middle character for odd-length strings. "racecar" has "e" in the middle.',
        label: 'Optional middle character',
        pattern: '.?',
      },
      {
        color: 'purple',
        description:
          'Matches the accumulated reversed suffix \\2. If the string is a palindrome, this matches perfectly.',
        label: 'Match reversed suffix',
        pattern: '\\2?',
      },
      {
        color: 'cyan',
        description:
          'Must reach end of string. If the front-to-back traversal built the correct reversed suffix, the palindrome is confirmed.',
        label: 'End anchor',
        pattern: '$',
      },
    ],
    subtitle: 'Simulates a two-pointer algorithm using lookaheads and self-referential capture groups.',
    testCases: [
      { input: 'racecar', label: 'racecar', shouldMatch: true },
      { input: 'abba', label: 'abba', shouldMatch: true },
      { input: 'hello', label: 'hello', shouldMatch: false },
      { input: 'a', label: 'single char', shouldMatch: true },
    ],
    title: 'Palindrome Matcher',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 15. Fibonacci String Matcher
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'awesome',
    dangerLevel: 3,
    emoji: '🌀',
    explanation: `The base case handles lengths 1 and 2 (both Fibonacci). After that, each loop iteration advances by one Fibonacci number using capture groups as registers.

Each iteration carries forward enough state in capture groups to compute the next Fibonacci number. The engine is simulating a Fibonacci-stepping state machine through backreferences and lookaheads.

The capture groups are functioning as CPU registers. This is not a regex. This is a program wearing a regex's skin.`,
    id: 15,
    jsCompatible: false,
    jsValidator: (input: string) => {
      if (!/^x+$/.test(input)) return false
      const n = input.length
      let a = 1
      let b = 2
      while (a < n) {
        const t = a + b
        a = b
        b = t
      }
      return a === n
    },
    regex: '^(xx?|(x*)\\2x(?=\\2(x+))(?=\\3*$)(?=((x*)\\6x)\\5*$)\\4)+$',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description:
          "Matches one or two x's — both are Fibonacci numbers (F(1)=1, F(2)=2). The base case for the sequence.",
        label: 'Base case: 1 or 2',
        pattern: 'xx?',
      },
      {
        color: 'green',
        description:
          'Captures the previous Fibonacci number as \\2 and positions the cursor. The capture group acts as a register storing Fib(n-1).',
        label: 'Position at previous Fib number',
        pattern: '(x*)\\2x',
      },
      {
        color: 'pink',
        description:
          'Looks ahead to capture the next chunk as \\3, establishing the Fib(n-1) + Fib(n) = Fib(n+1) relationship.',
        label: 'Capture next chunk',
        pattern: '(?=\\2(x+))',
      },
      {
        color: 'purple',
        description:
          'Asserts the remaining length is divisible by \\3. A mathematical constraint enforced via lookahead.',
        label: 'Assert divisibility',
        pattern: '(?=\\3*$)',
      },
      {
        color: 'orange',
        description:
          "Nested captures \\4/\\5/\\6 compute the NEXT Fibonacci term. The capture groups are functioning as CPU registers. This is not a regex. This is a program wearing a regex's skin.",
        label: 'Build next Fibonacci term',
        pattern: '(?=((x*)\\6x)\\5*$)',
      },
      {
        color: 'yellow',
        description:
          'Actually consume the characters computed by the lookaheads. The loop carries forward enough state to compute the next Fibonacci number on each iteration.',
        label: 'Consume computed term',
        pattern: '\\4',
      },
    ],
    subtitle: 'Might be the most conceptually unhinged regex ever written.',
    testCases: [
      { input: 'x', label: '1 (Fib)', shouldMatch: true },
      { input: 'xx', label: '2 (Fib)', shouldMatch: true },
      { input: 'xxxxx', label: '5 (Fib)', shouldMatch: true },
      { input: 'xxxxxxxxxxxx', label: '12 (not Fib)', shouldMatch: false },
      { input: 'xxxxxxxxxxxxx', label: '13 (Fib)', shouldMatch: true },
      { input: 'abcde', label: 'length 5, wrong chars', shouldMatch: false },
    ],
    title: 'Fibonacci String Matcher',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 16. The Quine
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'awesome',
    dangerLevel: 2,
    emoji: '🎭',
    explanation: `The pattern is hand-crafted so that backreferences reconstruct the literal characters of the pattern itself. Each capture group grabs a fragment, and forward references reassemble them in order. The lookahead at the start captures the pattern's structure, and the body re-matches those same characters literally.

The theoretical question ("does a self-matching regex exist?") connects to fixed-point theory and Kleene's recursion theorem, which guarantees that in any sufficiently expressive system, self-referential programs exist.

The simpler (.*)\\1 matches any string repeated twice, which is a different thing entirely. The true quine matches only itself. That distinction is the difference between a party trick and genuine madness.`,
    id: 16,
    jsCompatible: false,
    regex:
      '^(?=(.{3})((.)\x033{3})((.)\x055(.)\x077\x055(.)\x099\x055)\\4)(.{3})((.)\x0B1{3})((.)\x0D3(.)\x0F5\x0D3(.)\x117\x0D3)\\10$',
    section: 'appendix',
    segments: [
      {
        color: 'purple',
        description:
          "The entire first half is a zero-width lookahead that captures fragments of the pattern's own structure without consuming input.",
        label: 'Lookahead structure',
        pattern: '(?=',
      },
      {
        color: 'cyan',
        description:
          'Captures three characters at a time. Each group grabs a structural fragment of the pattern itself.',
        label: 'Capture 3-char fragment',
        pattern: '(.{3})',
      },
      {
        color: 'pink',
        description:
          "Captures individual characters that will be referenced by backreferences to reconstruct the pattern's literal text.",
        label: 'Nested character capture',
        pattern: '((.)',
      },
      {
        color: 'green',
        description:
          'Forward references reassemble the captured fragments in order. The body re-matches those same characters literally.',
        label: 'Backreference reconstruction',
        pattern: '\\4)',
      },
      {
        color: 'yellow',
        description:
          'The true quine matches ONLY itself — not any repeated string, not a generic self-reference, but specifically its own source text.',
        label: 'End anchor',
        pattern: '$',
      },
    ],
    subtitle: 'A regex that matches its own source text. A quine.',
    testCases: [],
    title: 'The Quine',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 17. SQL SELECT Validator
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'cursed',
    dangerLevel: 4,
    emoji: '🎪',
    explanation: `It covers SELECT, FROM, JOIN (all five types), WHERE (with LIKE, IN, BETWEEN, IS NULL), GROUP BY, HAVING, ORDER BY, and LIMIT/OFFSET. It handles column aliases, table prefixes, parenthesized subexpressions three levels deep, and multiple comparison operators.

It also handles roughly 40% of valid SQL. No subqueries in FROM. No CTEs. No window functions. No CASE expressions. No UNION. No vendor-specific syntax. It can't validate SELECT * FROM (SELECT 1) t. It's the regex equivalent of building half a bridge and cutting the ribbon.`,
    flags: 'i',
    id: 17,
    jsCompatible: true,
    jsRegex:
      '^\\s*SELECT\\s+(?:(?:ALL|DISTINCT)\\s+)?(?:\\*|(?:(?:[\\w]+\\.)?[\\w]+(?:\\s+(?:AS\\s+)?[\\w]+)?(?:\\s*,\\s*(?:[\\w]+\\.)?[\\w]+(?:\\s+(?:AS\\s+)?[\\w]+)?)*))\\s+FROM\\s+(?:[\\w]+\\.)?[\\w]+',
    regex:
      '^\\s*SELECT\\s+(?:(?:ALL|DISTINCT)\\s+)?(?:\\*|(?:(?:(?:[\\w]+\\.)?[\\w]+|\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\))(?:\\s+(?:AS\\s+)?[\\w]+)?(?:\\s*,\\s*(?:(?:[\\w]+\\.)?[\\w]+|\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\))(?:\\s+(?:AS\\s+)?[\\w]+)?)*))\\s+FROM\\s+',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description:
          'Optional leading whitespace, then the SELECT keyword followed by mandatory whitespace. The journey of a thousand miles begins.',
        label: 'SELECT keyword',
        pattern: '\\s*SELECT\\s+',
      },
      {
        color: 'purple',
        description: 'Optional query modifier. ALL is the default (rarely written), DISTINCT deduplicates results.',
        label: 'Optional ALL/DISTINCT',
        pattern: '(?:ALL|DISTINCT)\\s+',
      },
      {
        color: 'yellow',
        description: 'The wildcard: select everything. The alternative to listing specific columns.',
        label: 'Select all columns',
        pattern: '\\*',
      },
      {
        color: 'green',
        description: 'Matches table.column or just column. The optional table prefix uses [\\w]+\\. for dot notation.',
        label: 'Column reference',
        pattern: '(?:[\\w]+\\.)?[\\w]+',
      },
      {
        color: 'pink',
        description:
          'Handles parenthesized subexpressions three levels deep. Each level manually nests the pattern. A fourth level of nesting breaks it.',
        label: 'Nested parentheses (3 levels)',
        pattern: '\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)',
      },
      {
        color: 'orange',
        description: 'Optional AS keyword for column aliasing. Both "col AS alias" and "col alias" syntax supported.',
        label: 'Column alias',
        pattern: '(?:AS\\s+)?[\\w]+',
      },
      {
        color: 'cyan',
        description: 'The FROM clause. After 900 characters of column parsing, we finally get to the table.',
        label: 'FROM keyword',
        pattern: 'FROM\\s+',
      },
    ],
    subtitle:
      'Covers SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT/OFFSET. Handles roughly 40% of valid SQL.',
    testCases: [
      { input: 'SELECT * FROM users', label: 'simple select', shouldMatch: true },
      { input: 'SELECT name, age FROM users', label: 'columns', shouldMatch: true },
      { input: 'INSERT INTO users', label: 'not SELECT', shouldMatch: false },
    ],
    title: 'SQL SELECT Validator',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 18. The Meta-Regex
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content: `GitHub's Atom editor used regex-based syntax highlighting and suffered persistent catastrophic backtracking. Users reported multi-minute hangs on large files where Sublime Text did the same job in two seconds. This exact category of problem — regex matching regex-like structures — was a major driver behind Neovim's adoption of [tree-sitter](https://tree-sitter.github.io/tree-sitter/) as a replacement for regex-based highlighting.`,
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'cursed',
    dangerLevel: 4,
    emoji: '🪞',
    explanation: `It handles escaped characters, metacharacters, character classes with the tricky leading-] rule, groups with non-capturing and lookahead prefixes, quantifiers with lazy and possessive modifiers, and alternation.

It's necessarily incomplete. Regex syntax differs across PCRE, ECMAScript, POSIX, and others, so a "correct" meta-regex would need to target a specific engine. It also can't validate semantic correctness: \\1 without a corresponding capture group is syntactically legal but semantically broken. The meta-regex validates form, not meaning. Just like a lot of real code review.`,
    id: 18,
    jsCompatible: true,
    jsRegex: String.raw`^(?:(?:(?:\\.)|[\^$.]|[^\\()\[\]{}|*+?.\^$]|\[(?:\^?\]?(?:[^\]\\]|\\.)*)\]|\((?:\?(?::|!|=))?(?:(?:\\.)|[\^$.]|[^\\()\[\]{}|*+?.\^$]|\[(?:\^?\]?(?:[^\]\\]|\\.)*)\]|\|)*\))(?:[*+?]|\{\d+(?:,\d*)?\})?[?+]?|\|)*$`,
    regex: String.raw`^(?:(?:(?:\\.)|[\^$.]|[^\\()\[\]{}|*+?.\^$]|\[(?:\^?\]?(?:[^\]\\]|\\.)*)\]|\((?:\?(?::|!|=))?(?:(?:\\.)|[\^$.]|[^\\()\[\]{}|*+?.\^$]|\[(?:\^?\]?(?:[^\]\\]|\\.)*)\]|\|)*\))(?:[*+?]|\{\d+(?:,\d*)?\})?[?+]?|\|)*$`,
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description: 'Matches backslash followed by any character — the universal escape mechanism in regex syntax.',
        label: 'Escaped characters',
        pattern: '(?:\\\\.)',
      },
      {
        color: 'yellow',
        description: 'The special regex metacharacters: ^, $, and . (dot). Each has special meaning in a regex.',
        label: 'Metacharacters',
        pattern: '[\\^$.]',
      },
      {
        color: 'green',
        description: "Anything that ISN'T a metacharacter or structural character. The plain text in a regex.",
        label: 'Literal characters',
        pattern: '[^\\\\()[\\]{}|*+?.\\^$]',
      },
      {
        color: 'purple',
        description:
          'Validates character class syntax []. Handles the tricky leading-] rule: []] is valid and matches a literal ].',
        label: 'Character classes',
        pattern: '\\[(?:\\^?\\]?(?:[^\\]\\\\]|\\\\.)*)]',
      },
      {
        color: 'pink',
        description:
          'Non-capturing (?:), positive lookahead (?=), and negative lookahead (?!). Other engines add more prefixes, which is exactly why this gets messy.',
        label: 'Group type prefixes',
        pattern: '\\?(?::|!|=)',
      },
      {
        color: 'orange',
        description:
          'Optional *, +, or ? quantifier, then optional {n,m} range quantifier, then optional lazy ? or possessive + modifier. The full quantifier syntax.',
        label: 'Quantifiers',
        pattern: '[*+?]?(?:\\{(?:\\d+(?:,\\d*)?)\\})?[?+]?',
      },
      {
        color: 'yellow',
        description: 'The pipe character for alternation between branches.',
        label: 'Alternation',
        pattern: '\\|',
      },
    ],
    subtitle: 'A regex that validates whether a string is a valid regex. A poem about what constitutes a valid poem.',
    testCases: [
      { input: '^[a-z]+$', label: 'simple regex', shouldMatch: true },
      { input: '(?:hello|world)', label: 'non-capturing group', shouldMatch: true },
      { input: '[', label: 'unclosed bracket', shouldMatch: false },
    ],
    title: 'The Meta-Regex',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 19. The Matryoshka
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    bodyCount: {
      content: `The nested quantifier pattern appears in the wild more often than you'd hope. [CVE-2016-10540](https://nvd.nist.gov/vuln/detail/CVE-2016-10540) hit [minimatch](https://www.npmjs.com/package/minimatch) (one of npm's most-downloaded packages). [CVE-2021-27293](https://nvd.nist.gov/vuln/detail/CVE-2021-27293) nailed RestSharp with \`(-?\\d+)*\`, the same nesting in a fancier outfit. [CVE-2023-26116](https://nvd.nist.gov/vuln/detail/CVE-2023-26116) through CVE-2023-26118 found three separate instances in AngularJS. A 2024 analysis found over 10% of popular GitHub projects were vulnerable to ReDoS.`,
      emoji: '🪦',
      label: 'Body count',
    },
    category: 'cursed',
    dangerLevel: 5,
    emoji: '🪆',
    explanation: `If (a+)+ creates O(2^n) backtracking paths, then ((a+)+)+ creates roughly O(2^(2^n)). Five levels deep produces a tower of exponentials so large that the number of steps to reject "aaaaaaaaaaaaaaaaaaX" exceeds the number of particles in the observable universe by a margin that itself exceeds the number of particles in the observable universe.

In practice, the engine locks up on inputs as short as 15-20 characters. This is ReDoS taken to its logical extreme: the simplest possible construction of the most devastating possible backtracking behavior. Automaton-based engines (RE2, Rust regex) handle it in linear time, because they don't backtrack at all.`,
    id: 19,
    jsCompatible: true,
    jsRegex: '^((((a+)+)+)+)+$',
    maxInputLength: 16,
    regex: '^((((a+)+)+)+)+$',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description: 'The base: match one or more a characters.',
        label: "Innermost: one or more a's",
        pattern: 'a+',
      },
      {
        color: 'green',
        description: 'First nesting. Creates O(2^n) backtracking paths — the classic catastrophic pattern.',
        label: 'Level 2: O(2^n)',
        pattern: '(a+)+',
      },
      {
        color: 'yellow',
        description:
          'Second nesting. Multiplies the backtracking space exponentially AGAIN. A tower of exponentials begins.',
        label: 'Level 3: O(2^(2^n))',
        pattern: '((a+)+)+',
      },
      {
        color: 'orange',
        description:
          'Third nesting. The number of steps now exceeds the number of particles in the observable universe.',
        label: 'Level 4: beyond comprehension',
        pattern: '(((a+)+)+)+',
      },
      {
        color: 'pink',
        description:
          'Fourth nesting. The number of backtracking steps exceeds the number of particles in the universe by a margin that ITSELF exceeds the number of particles in the universe. ReDoS taken to its logical extreme.',
        label: 'Level 5: mathematical madness',
        pattern: '((((a+)+)+)+)+',
      },
    ],
    subtitle: 'Five nested quantifiers. A tower of exponentials.',
    testCases: [
      { input: 'aaaaaa', label: 'aaaaaa', shouldMatch: true },
      { input: 'a', label: 'single a', shouldMatch: true },
      { input: 'b', label: 'wrong char', shouldMatch: false },
    ],
    title: 'The Matryoshka',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 20. International Phone Number
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'cursed',
    dangerLevel: 3,
    emoji: '🌍',
    explanation: `Twenty country-specific branches, each encoding a different nation's phone format. US/Canada with area codes. UK with trunk prefixes. Germany with its 6-to-12-digit variable-length area codes. China mobile starting with 1[3-9]. Brazil with its optional 9th digit.

Every branch allows optional separators between digit groups, and optional + country code prefix. And then there's the catch-all branch: it accepts most 3-digit country codes followed by 6-12 digits. Worse, the entire country code prefix is optional, so bare strings of 6-12 digits match with no country code at all.

Between the catch-all's broad acceptance and the missing prefix enforcement, this regex will "validate" phone numbers the way a bouncer who lets everyone in "checks IDs."`,
    id: 20,
    jsCompatible: true,
    jsRegex:
      '^(?:(?:\\+?1[\\s.-]?)?(?:\\(?[2-9]\\d{2}\\)?[\\s.-]?){1,2}\\d{4}|(?:\\+?44[\\s.-]?)?\\(?0?\\)?[\\s.-]?(?:\\d[\\s.-]?){9,10}|(?:\\+?49[\\s.-]?)?\\(?0?\\)?[\\s.-]?(?:\\d[\\s.-]?){6,12})$',
    regex:
      '^(?:(?:\\+?1[\\s.-]?)?(?:\\(?[2-9]\\d{2}\\)?[\\s.-]?){1,2}\\d{4}|(?:\\+?44[\\s.-]?)?\\(?0?\\)?[\\s.-]?(?:\\d[\\s.-]?){9,10}|(?:\\+?49[\\s.-]?)?\\(?0?\\)?[\\s.-]?(?:\\d[\\s.-]?){6,12})$',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description: 'Optional +1 country code with optional separator. Handles "1-", "+1 ", or nothing.',
        label: 'US/Canada country code',
        pattern: '(?:\\+?1[\\s.-]?)?',
      },
      {
        color: 'green',
        description:
          'Area code starting with 2-9, optionally in parentheses. Repeated 1-2 times for area code + exchange.',
        label: 'US area code + exchange',
        pattern: '(?:\\(?[2-9]\\d{2}\\)?[\\s.-]?){1,2}',
      },
      {
        color: 'purple',
        description: 'Four-digit subscriber number. The most predictable part of any phone number.',
        label: 'US subscriber number',
        pattern: '\\d{4}',
      },
      {
        color: 'orange',
        description: 'Optional +44 for the UK, with flexible separators.',
        label: 'UK country code',
        pattern: '(?:\\+?44[\\s.-]?)?',
      },
      {
        color: 'yellow',
        description: 'Optional 0 trunk prefix (common in UK/DE format). May be in parentheses.',
        label: 'Trunk prefix',
        pattern: '\\(?0?\\)?[\\s.-]?',
      },
      {
        color: 'orange',
        description:
          'Nine or ten digits with optional separators between each. Very permissive — accepts many invalid number formats.',
        label: 'UK digit sequence',
        pattern: '(?:\\d[\\s.-]?){9,10}',
      },
      {
        color: 'pink',
        description:
          "Optional +49. Germany's 6-to-12-digit variable-length area codes make this branch especially broad.",
        label: 'Germany country code',
        pattern: '(?:\\+?49[\\s.-]?)?',
      },
      {
        color: 'pink',
        description:
          'Six to twelve digits — so broad that "123456" matches as a valid German phone number. The catch-all in the specific branches.',
        label: 'German digit sequence',
        pattern: '(?:\\d[\\s.-]?){6,12}',
      },
    ],
    subtitle: "Twenty country-specific branches. Each encoding a different nation's phone format.",
    testCases: [
      { input: '+1 (555) 234-5678', label: 'US format', shouldMatch: true },
      { input: '+44 20 7946 0958', label: 'UK format', shouldMatch: true },
      { input: '+49 30 12345678', label: 'German format', shouldMatch: true },
      { input: '123', label: 'too short', shouldMatch: false },
    ],
    title: 'International Phone Number: Every Country',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 21. The Void
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    category: 'cursed',
    dangerLevel: 1,
    emoji: '🕳️',
    explanation: `Seven levels of nested zero-width lookahead assertions, each asserting the existence of a zero-length match of the next inner assertion, each quantified to {0} (match zero times). The innermost . would match a character, but {0} means "don't." The next layer asserts that match exists, but also {0}. All the way up. Every layer negates itself.

The entire expression collapses to nothing. Since there are no anchors, it succeeds at position zero of whatever you feed it. It's equivalent to an empty regex. Some engines will still walk the entire assertion tree before concluding there's nothing to do, so it has non-zero computational cost for zero information content.

It's a Rube Goldberg machine that, after 47 steps, does absolutely nothing. And that's kind of beautiful.`,
    id: 21,
    jsCompatible: true,
    jsRegex: '(?:(?=(?:(?=(?:(?=(?:(?=.){0}){0}){0}){0}){0}).){0}){0}',
    matchMode: 'contains',
    regex: '(?:(?=(?:(?=(?:(?=(?:(?=.){0}){0}){0}){0}){0}).){0}){0}',
    section: 'appendix',
    segments: [
      {
        color: 'cyan',
        description: 'Would match any character. But it never gets the chance.',
        label: 'The innermost dot',
        pattern: '.',
      },
      {
        color: 'pink',
        description: "Match zero times. The dot is negated. It exists and doesn't exist simultaneously.",
        label: 'Zero repetitions (innermost)',
        pattern: '{0}',
      },
      {
        color: 'purple',
        description:
          'A lookahead asserting the existence of a zero-length match of the layer below. Asserting that nothing exists.',
        label: 'Layer 2: assert nothing',
        pattern: '(?=(?:(?=.){0})',
      },
      {
        color: 'orange',
        description:
          'Three more layers of nested zero-width assertions, each asserting the existence of nothing from the layer below. Every layer negates itself.',
        label: 'Layers 3-5: deeper nothing',
        pattern: '(?=(?:(?=(?:(?=.){0}){0}){0})',
      },
      {
        color: 'yellow',
        description:
          'The final {0}. The entire seven-layer cake collapses to nothing. Since there are no anchors, it succeeds at position zero of whatever you feed it. Equivalent to an empty regex.',
        label: 'Outermost: match zero times',
        pattern: '(?:...){0}',
      },
    ],
    subtitle: 'Produces a zero-length match at the start of any string. Always matches. Never consumes anything.',
    testCases: [
      { input: '', label: 'empty string', shouldMatch: true },
      { input: 'hello', label: 'hello (still matches)', shouldMatch: true },
      { input: 'literally anything', label: 'anything at all', shouldMatch: true },
    ],
    title: 'The Void',
  },
]
