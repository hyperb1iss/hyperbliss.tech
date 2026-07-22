# Dev.to Markdown Format Reference

## Parser

Dev.to uses **Redcarpet** (Ruby) with **Rouge** syntax highlighting. GFM-compatible with extensions.

## Supported Markdown Extensions

- **Autolinks** — bare URLs become clickable
- **Strikethrough** — `~~text~~`
- **Tables** — GFM pipe tables
- **Footnotes** — `[^1]` syntax
- **Fenced code blocks** — triple backticks with language ID
- **No superscript** — `^text` does not work

## Frontmatter

```yaml
---
title: 'Article Title'
published: false
description: 'Brief summary for social cards'
tags: tag1, tag2, tag3, tag4
cover_image: https://example.com/image.png
canonical_url: https://yourblog.com/original
series: 'Series Name'
---
```

- Max **4 tags**, alphanumeric only, max 30 chars each
- `description` populates Twitter/OpenGraph cards
- Cover image optimal: 1000x420px
- Frontmatter in `body_markdown` overrides JSON API fields

## Liquid Tags

### Universal Embed

```
{% embed https://url %}
```

Supports 30+ platforms: YouTube, Vimeo, CodePen, CodeSandbox, GitHub, Replit, StackBlitz, JSFiddle, Twitter/X, Spotify, SoundCloud, and more.

### Content Blocks

```
{% details Summary Text %}
hidden content (markdown supported)
{% enddetails %}

{% katex %}
c = \pm\sqrt{a^2 + b^2}
{% endkatex %}

{% katex inline %}E = mc^2{% endkatex %}

{% cta https://link %}description{% endcta %}
```

### Dev.to Internal

```
{% link https://dev.to/... %}     — rich article card
{% user username %}               — profile card
{% tag tagname %}                  — tag badge
{% github user/repo %}            — repo embed
```

## Allowed HTML Tags

**Whitelisted:** `a`, `abbr`, `b`, `blockquote`, `br`, `center`, `cite`, `code`, `dd`, `del`, `dl`, `dt`, `em`, `figcaption`, `h1`-`h6`, `hr`, `img`, `kbd`, `li`, `mark`, `ol`, `p`, `pre`, `q`, `small`, `span`, `strong`, `sub`, `sup`, `table`, `tbody`, `td`, `tfoot`, `th`, `thead`, `tr`, `u`, `ul`, `video`, `source`, SVG elements

**Stripped:** `div`, `iframe`, `section`, `article`, `nav`, `header`, `footer`, `details`, `summary`, `input`, `form`, `script`, `style`

Use `{% details %}` liquid tag instead of `<details>/<summary>`.

## Code Blocks

Standard fenced blocks with language ID:

````
```javascript
const x = 42;
```
````

Rouge supports 200+ languages. Unrecognized IDs render as plain text.

## Images

External URLs work: `![alt](https://example.com/img.png)`

For sizing use HTML: `<img src="..." width="400" alt="..." />`

GIF limit: 200 megapixels per frame.

## API Reference

### Create Article

```
POST https://dev.to/api/articles
Header: api-key: YOUR_KEY
Content-Type: application/json

{
  "article": {
    "title": "string (required)",
    "body_markdown": "string",
    "published": false,
    "tags": ["tag1", "tag2"],
    "canonical_url": "string",
    "description": "string",
    "main_image": "string",
    "series": "string"
  }
}
```

Returns `201` with article object including `id`, `url`, `slug`.

### Update Article

```
PUT https://dev.to/api/articles/{id}
```

Same body format. Returns `200`.

### Rate Limits

- GET: 3 req/sec per IP
- POST/PUT/DELETE: 1 req/sec per API key
- 429 response includes `Retry-After` header
