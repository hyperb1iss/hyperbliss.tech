# Resume PDF Generator

Generates a styled PDF resume from markdown using Playwright (headless Chromium).

## Prerequisites

Playwright requires the Chromium browser. First-time setup:

```bash
uv run --project scripts/resume-pdf playwright install chromium
```

## Usage

From the project root:

```bash
# Generate PDF (outputs to public/resume.pdf)
uv run --project scripts/resume-pdf resume-pdf content/resume/resume.md

# Or with custom output path
uv run --project scripts/resume-pdf resume-pdf content/resume/resume.md -o custom-output.pdf
```

## Development

```bash
cd scripts/resume-pdf
uv sync
uv run resume-pdf ../../content/resume/resume.md
```
