#!/usr/bin/env bash
# hypercast publish — convert and publish a blog post to dev.to as a draft
# Usage: bash publish.sh <slug>
# Env:   DEVTO_API_KEY must be set
set -euo pipefail

SLUG="${1:?Usage: publish.sh <slug>}"

if [[ -z "${DEVTO_API_KEY:-}" ]]; then
  echo '{"error": "DEVTO_API_KEY not set. Get one at https://dev.to/settings/extensions"}' >&2
  exit 1
fi

if [[ ! -f "content/posts/${SLUG}.md" ]]; then
  echo "{\"error\": \"Post not found: content/posts/${SLUG}.md\"}" >&2
  exit 1
fi

exec node -e "
const fs = require('fs');
const matter = require('gray-matter');
const https = require('https');

const slug = process.argv[1];
const file = fs.readFileSync('content/posts/' + slug + '.md', 'utf-8');
const { data, content } = matter(file);

const title = data.emoji ? data.emoji + ' ' + data.title : data.title;
const tags = (data.tags || [])
  .slice(0, 4)
  .map(t => String(t).replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
  .filter(Boolean);
const mainImage = data.coverImage
  ? (data.coverImage.startsWith('http') ? data.coverImage : 'https://hyperbliss.tech/images/' + data.coverImage)
  : null;

// Transform markdown for dev.to
let body = content.trim()
  .replace(/<details>\s*<summary>([^<]*)<\/summary>/g, '{% details \$1 %}')
  .replace(/<\/details>/g, '{% enddetails %}')
  .replace(/<\/?div[^>]*>/g, '')
  .replace(/\\\$\\\$([^\$]*)\\\$\\\$/g, '{% katex %}\$1{% endkatex %}');

// Append cross-post footer
body += '\n\n---\n\n*Originally published at [hyperbliss.tech](https://hyperbliss.tech/blog/' + slug + '/). Follow me on [GitHub](https://github.com/hyperb1iss) and [Bluesky](https://bsky.app/profile/hyperbliss.tech).*';

const payload = JSON.stringify({
  article: {
    title,
    body_markdown: body,
    published: false,
    tags,
    canonical_url: 'https://hyperbliss.tech/blog/' + slug + '/',
    description: data.excerpt || '',
    ...(mainImage && { main_image: mainImage }),
  }
});

const req = https.request({
  hostname: 'dev.to',
  path: '/api/articles',
  method: 'POST',
  headers: {
    'api-key': process.env.DEVTO_API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'User-Agent': 'hypercast/1.0',
  }
}, (res) => {
  let d = '';
  res.on('data', chunk => d += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const r = JSON.parse(d);
      console.log(JSON.stringify({
        success: true,
        title: r.title,
        id: r.id,
        url: r.url,
        edit_url: 'https://dev.to/' + r.user.username + '/' + r.slug + '/edit',
        status: 'draft',
      }, null, 2));
    } else {
      console.error(JSON.stringify({ error: 'API returned ' + res.statusCode, body: d.substring(0, 500) }));
      process.exit(1);
    }
  });
});
req.on('error', e => { console.error(JSON.stringify({ error: e.message })); process.exit(1); });
req.write(payload);
req.end();
" -- "$SLUG"
