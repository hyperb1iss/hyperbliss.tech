---
name: hypercast
description: This skill should be used when the user asks to "publish to dev.to", "hypercast", "syndicate a post", "cross-post to dev.to", "push to dev.to", or mentions publishing blog content to external platforms. Converts hyperbliss.tech blog posts to dev.to format and publishes as drafts via the Forem API.
---

# Hypercast — Dev.to Syndication

Publish blog posts from `content/posts/` to dev.to as drafts. The post is formatted for dev.to's markdown dialect, published with `published: false`, and the draft URL is returned for manual review before going live.

## Usage

Invoked as `/hypercast <slug>` where slug matches a file in `content/posts/`. Example:

```
/hypercast 2026.04.04_terminal-renaissance
```

To list available posts: `/hypercast list`

## Workflow

1. **Read** the markdown file from `content/posts/{slug}.md`
2. **Convert** to dev.to format using the conversion rules below
3. **Publish** as a draft via `POST https://dev.to/api/articles`
4. **Report** the draft URL for review

## Environment

The `DEVTO_API_KEY` environment variable must be set. Generate one at https://dev.to/settings/extensions under "DEV Community API Keys."

If the key is missing, prompt the user to set it.

## Conversion Rules

### Frontmatter Translation

Source frontmatter (gray-matter):
```yaml
title: 'Post Title'
date: '2026-04-04'
emoji: '📝'
excerpt: 'Description text'
tags: [tag1, tag2, tag3, tag4, tag5]
author: 'Stefanie Jane'
coverImage: 'image.jpg'
```

Target dev.to article JSON:
```json
{
  "article": {
    "title": "📝 Post Title",
    "body_markdown": "...",
    "published": false,
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "canonical_url": "https://hyperbliss.tech/blog/{slug}/",
    "description": "Description text",
    "main_image": "https://hyperbliss.tech/images/{coverImage}"
  }
}
```

Rules:
- Prepend emoji to title if present
- Max 4 tags, alphanumeric only (strip hyphens/special chars, lowercase)
- Canonical URL always points back to hyperbliss.tech
- Cover image: prefix with `https://hyperbliss.tech/images/` if relative path
- Always `published: false` — drafts only

### Markdown Transformations

Apply these transformations to the markdown body before publishing:

| Source | Dev.to |
|--------|--------|
| `<details><summary>Text</summary>` | `{% details Text %}` |
| `</details>` | `{% enddetails %}` |
| `<div>...</div>` | Strip the div tags, keep inner content |
| `<kbd>text</kbd>` | Keep as-is (whitelisted) |
| `<mark>text</mark>` | Keep as-is (whitelisted) |
| Bare YouTube URLs | `{% embed URL %}` |
| Bare CodePen URLs | `{% embed URL %}` |
| `$$math$$` | `{% katex %}math{% endkatex %}` |
| `$inline$` | `{% katex inline %}inline{% endkatex %}` |

### Footer

Append a cross-post footer to every article:

```markdown

---

*Originally published at [hyperbliss.tech](https://hyperbliss.tech/blog/{slug}/). Follow me on [GitHub](https://github.com/hyperb1iss) and [Bluesky](https://bsky.app/profile/hyperbliss.tech).*
```

## Publishing via API

Execute the publish script:

```bash
bash .claude/skills/hypercast/scripts/publish.sh <slug>
```

The script handles reading the file, conversion, and API call. Parse its JSON output for the draft URL.

If the script is not available or fails, perform the equivalent steps manually:
1. Read the post with the Read tool
2. Transform the content following the conversion rules
3. Use curl or the WebFetch tool to POST to the API

## Post-Publish

After successful publish:
- Report the dev.to draft URL
- Remind the user to review formatting and add a cover image if needed
- Note that the post is a draft — publish manually on dev.to when ready

## Listing Posts

When invoked with `list`, read the `content/posts/` directory and display available slugs with their titles and dates.

## Additional Resources

### Reference Files
- **`references/devto-format.md`** — Complete dev.to markdown format reference including all liquid tags, HTML whitelist, and formatting quirks

### Scripts
- **`scripts/publish.sh`** — Shell script that reads a post, converts format, and publishes via the API
