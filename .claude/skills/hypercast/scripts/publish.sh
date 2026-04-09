#!/usr/bin/env bash
# hypercast publish — convert and publish a blog post to dev.to as a draft
#
# Usage: bash publish.sh <slug>
# Env:   DEVTO_API_KEY must be set
#
# Reads content/posts/<slug>.md, converts to dev.to format, publishes as draft.
# Outputs JSON with the draft URL on success.

set -euo pipefail

SLUG="${1:?Usage: publish.sh <slug>}"
BASE_URL="https://hyperbliss.tech"
POSTS_DIR="content/posts"
POST_FILE="${POSTS_DIR}/${SLUG}.md"

# ── Preflight ────────────────────────────────────────────────────────
if [[ -z "${DEVTO_API_KEY:-}" ]]; then
  echo '{"error": "DEVTO_API_KEY not set. Get one at https://dev.to/settings/extensions"}' >&2
  exit 1
fi

if [[ ! -f "$POST_FILE" ]]; then
  echo "{\"error\": \"Post not found: ${POST_FILE}\"}" >&2
  exit 1
fi

# ── Parse frontmatter ────────────────────────────────────────────────
RAW=$(cat "$POST_FILE")

# Extract frontmatter between --- delimiters
FRONTMATTER=$(echo "$RAW" | sed -n '/^---$/,/^---$/p' | sed '1d;$d')

# Extract body (everything after second ---)
BODY=$(echo "$RAW" | sed -n '/^---$/,/^---$/!p' | tail -n +2)

# Parse frontmatter fields
get_fm() {
  echo "$FRONTMATTER" | grep -E "^${1}:" | head -1 | sed "s/^${1}:[[:space:]]*//" | sed "s/^['\"]//;s/['\"]$//"
}

TITLE=$(get_fm "title")
EXCERPT=$(get_fm "excerpt")
EMOJI=$(get_fm "emoji")
COVER=$(get_fm "coverImage")

# Parse tags array — handle both [tag1, tag2] and yaml list formats
TAGS_RAW=$(echo "$FRONTMATTER" | grep -E "^tags:" | sed 's/^tags:[[:space:]]*//')
# Strip brackets, split by comma, clean up, take first 4, make alphanumeric lowercase
TAGS=$(echo "$TAGS_RAW" | tr -d '[]' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
  sed 's/[^a-zA-Z0-9]//g' | tr '[:upper:]' '[:lower:]' | head -4 | paste -sd ',' -)

# Build title with emoji
if [[ -n "$EMOJI" ]]; then
  FULL_TITLE="${EMOJI} ${TITLE}"
else
  FULL_TITLE="$TITLE"
fi

# Build cover image URL
COVER_URL=""
if [[ -n "$COVER" ]]; then
  if [[ "$COVER" == http* ]]; then
    COVER_URL="$COVER"
  else
    COVER_URL="${BASE_URL}/images/${COVER}"
  fi
fi

# ── Transform markdown ───────────────────────────────────────────────

# Convert <details><summary>...</summary> to {% details ... %}
BODY=$(echo "$BODY" | sed -E 's/<details>[[:space:]]*<summary>([^<]*)<\/summary>/{% details \1 %}/g')
BODY=$(echo "$BODY" | sed 's/<\/details>/{% enddetails %}/g')

# Strip <div> and </div> tags (keep content)
BODY=$(echo "$BODY" | sed 's/<\/?div[^>]*>//g')

# Convert $$math$$ to katex blocks
BODY=$(echo "$BODY" | sed 's/\$\$\([^$]*\)\$\$/{% katex %}\1{% endkatex %}/g')

# Append cross-post footer
BODY="${BODY}

---

*Originally published at [hyperbliss.tech](${BASE_URL}/blog/${SLUG}/). Follow me on [GitHub](https://github.com/hyperb1iss) and [Bluesky](https://bsky.app/profile/hyperbliss.tech).*"

# ── Build JSON payload ───────────────────────────────────────────────

# Use node to safely build JSON (handles escaping)
PAYLOAD=$(node -e "
const body = process.argv[1];
const payload = {
  article: {
    title: $(node -e "process.stdout.write(JSON.stringify(process.argv[1]))" -- "$FULL_TITLE"),
    body_markdown: body,
    published: false,
    tags: '${TAGS}'.split(',').filter(Boolean),
    canonical_url: '${BASE_URL}/blog/${SLUG}/',
    description: $(node -e "process.stdout.write(JSON.stringify(process.argv[1]))" -- "$EXCERPT"),
  }
};
if ('${COVER_URL}') payload.article.main_image = '${COVER_URL}';
process.stdout.write(JSON.stringify(payload));
" -- "$BODY")

# ── Publish ──────────────────────────────────────────────────────────

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://dev.to/api/articles" \
  -H "api-key: ${DEVTO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [[ "$HTTP_CODE" == "201" ]]; then
  URL=$(echo "$RESPONSE_BODY" | node -e "
    let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
      const r=JSON.parse(d);
      console.log(JSON.stringify({
        success: true,
        id: r.id,
        url: r.url,
        edit_url: 'https://dev.to/' + r.user.username + '/' + r.slug + '/edit',
        title: r.title,
        status: 'draft'
      }));
    })
  ")
  echo "$URL"
else
  echo "{\"error\": \"API returned ${HTTP_CODE}\", \"response\": ${RESPONSE_BODY}}" >&2
  exit 1
fi
