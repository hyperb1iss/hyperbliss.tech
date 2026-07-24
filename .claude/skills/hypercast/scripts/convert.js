#!/usr/bin/env node
// hypercast convert + publish — hyperbliss.tech blog post → dev.to draft
// Usage: node convert.js <slug> [--dry-run]
// Env:   DEVTO_API_KEY required unless --dry-run
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const matter = require('gray-matter');

const SITE = 'https://hyperbliss.tech';

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const slug = argv.find((a) => !a.startsWith('--'));

function fail(message) {
  console.error(JSON.stringify({ error: message }));
  process.exit(1);
}

if (!slug) fail('Usage: convert.js <slug> [--dry-run]');
if (!dryRun && !process.env.DEVTO_API_KEY) {
  fail('DEVTO_API_KEY not set. Get one at https://dev.to/settings/extensions');
}

const file = path.join('content/posts', `${slug}.md`);
if (!fs.existsSync(file)) fail(`Post not found: ${file}`);

const { data, content } = matter(fs.readFileSync(file, 'utf-8'));

// Prettier hard-wraps prose at ~72 cols and Redcarpet renders single
// newlines as <br>, so wrapped prose lines get joined. Fenced code must
// pass through byte-for-byte — joining or space-collapsing inside a fence
// destroys alignment and indentation.
function unwrapParagraphs(md) {
  const structural = /^(#{1,6} |[-*+] |\d+\. |> |!\[|---|\.\.\.| {4,}|\| )/;
  const fence = /^(```|~~~)/;
  const lines = md.split('\n');
  const out = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (fence.test(line.trim())) {
      inFence = !inFence;
      out.push(line + '\n');
      continue;
    }
    if (inFence) {
      out.push(line + '\n');
      continue;
    }
    const next = lines[i + 1];
    const keepBreak =
      line.trim() === '' ||
      structural.test(line) ||
      next == null ||
      next.trim() === '' ||
      structural.test(next) ||
      fence.test(next.trim()) ||
      line.endsWith('  ') ||
      line.endsWith('\\');
    out.push(keepBreak ? line + '\n' : line.replace(/\s+$/, '') + ' ');
  }
  return out.join('');
}

let body = unwrapParagraphs(content.trim())
  .replace(/<details>\s*<summary>([^<]*)<\/summary>/g, '{% details $1 %}')
  .replace(/<\/details>/g, '{% enddetails %}')
  .replace(/<\/?div[^>]*>/g, '')
  // site-local layout hints like ![[wide] alt](...) mean nothing off-site
  .replace(/!\[\[\w+\] ?/g, '![')
  // relative image/link targets must resolve against hyperbliss.tech, not dev.to
  .replace(/\]\(\//g, `](${SITE}/`)
  .replace(/\$\$([^$]+)\$\$/g, '{% katex %}$1{% endkatex %}');

body += `\n\n---\n\n*Originally published at [hyperbliss.tech](${SITE}/blog/${slug}/). Follow me on [GitHub](https://github.com/hyperb1iss) and [Bluesky](https://bsky.app/profile/hyperbliss.tech).*`;

const title = data.emoji ? `${data.emoji} ${data.title}` : data.title;
const tags = (data.tags || [])
  .slice(0, 4)
  .map((t) => String(t).replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
  .filter(Boolean);
const coverImage = data.coverImage
  ? data.coverImage.startsWith('http')
    ? data.coverImage
    : `${SITE}/images/${data.coverImage}`
  : null;
const firstBodyImage = (body.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)/) || [])[1] || null;
const mainImage = coverImage || firstBodyImage;

const payload = JSON.stringify({
  article: {
    title,
    body_markdown: body,
    published: false,
    tags,
    canonical_url: `${SITE}/blog/${slug}/`,
    description: data.excerpt || '',
    ...(mainImage && { main_image: mainImage }),
  },
});

if (dryRun) {
  console.log(payload);
  process.exit(0);
}

const req = https.request(
  {
    hostname: 'dev.to',
    path: '/api/articles',
    method: 'POST',
    headers: {
      'api-key': process.env.DEVTO_API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'User-Agent': 'hypercast/1.1',
    },
  },
  (res) => {
    let d = '';
    res.on('data', (chunk) => (d += chunk));
    res.on('end', () => {
      if (res.statusCode === 201) {
        const r = JSON.parse(d);
        console.log(
          JSON.stringify(
            {
              success: true,
              title: r.title,
              id: r.id,
              url: r.url,
              edit_url: `https://dev.to/${r.user.username}/${r.slug}/edit`,
              status: 'draft',
            },
            null,
            2,
          ),
        );
      } else {
        console.error(
          JSON.stringify({ error: `API returned ${res.statusCode}`, body: d.substring(0, 500) }),
        );
        process.exit(1);
      }
    });
  },
);
req.on('error', (e) => fail(e.message));
req.write(payload);
req.end();
