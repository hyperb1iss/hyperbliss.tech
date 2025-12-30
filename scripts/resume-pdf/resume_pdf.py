#!/usr/bin/env python3
"""Module to convert a markdown resume to a styled PDF."""

import argparse
import asyncio
import os
import re
import sys
import tempfile

import emoji
import markdown
from bs4 import BeautifulSoup
from jinja2 import Template
from playwright.async_api import async_playwright


def remove_emojis(text):
    """Remove emojis from the given text."""
    return emoji.replace_emoji(text, replace="")


def process_skills_paragraph(p, soup):
    """Process skills paragraph to create tag-like spans from pipe-separated items."""
    items = []
    current_category = None

    for content in list(p.contents):
        if isinstance(content, str):
            # Split by pipe and process each part
            text = content.strip()
            if text:
                parts = text.split("|")
                for part in parts:
                    part = part.strip().strip(":").strip()
                    if part and part != ":":
                        items.append(("text", part))
        elif hasattr(content, 'name'):
            if content.name == "a":
                # Extract link text and URL
                link_text = content.get_text().strip()
                if link_text:
                    items.append(("link", content))
            elif content.name == "strong":
                # This is a category label - add as category header
                cat_text = content.get_text().strip().rstrip(":")
                if cat_text:
                    current_category = cat_text
                    items.append(("category", cat_text))
            elif content.name == "br":
                pass  # Skip line breaks

    # Rebuild the paragraph with proper structure
    p.clear()
    p["class"] = p.get("class", []) + ["skills-list"]

    for item_type, item in items:
        if item_type == "category":
            # Add category as a label span
            cat_span = soup.new_tag("span")
            cat_span["class"] = ["skill-category"]
            cat_span.string = item + ":"
            p.append(cat_span)
            p.append(" ")
        elif item_type == "link":
            # Clone the link and add skill class
            item["class"] = item.get("class", []) + ["skill-tag"]
            p.append(item)
            p.append(" ")
        elif item_type == "text":
            span = soup.new_tag("span")
            span["class"] = ["skill-tag"]
            span.string = item
            p.append(span)
            p.append(" ")


def process_header_section(soup):
    """Process the header section to ensure proper centering."""
    # Find the first two paragraphs (tagline and links)
    paragraphs = soup.find_all("p")[:2]

    for p in paragraphs:
        # Add a special class to these paragraphs
        p["class"] = p.get("class", []) + ["header-content"]
        # Clean up whitespace between elements without destroying the links
        for br in p.find_all("br"):
            br.replace_with(" ")
        # Join text nodes with single spaces
        for text in p.find_all(string=True):
            if text.strip():
                text.replace_with(" " + text.strip() + " ")


def process_job_entries(soup):
    """Process job entries to combine role and date."""
    for h4 in soup.find_all("h4"):
        try:
            # Find the next paragraph (date)
            date_p = h4.find_next_sibling("p")
            if not date_p or not date_p.find("em"):
                continue

            # Extract the date text from em tag
            em_tag = date_p.find("em")
            if not em_tag or not em_tag.string:
                continue

            date_text = em_tag.string.strip()

            # Add date to h4 as data attribute
            h4["data-date"] = date_text

            # Create new span for title if h4 has content
            if h4.string:
                title_span = soup.new_tag("span")
                title_span.string = h4.string.strip()
                h4.string = ""
                h4.append(title_span)

            # Remove the original date paragraph
            date_p.decompose()

        except Exception as e:
            print(f"Warning: Could not process job entry: {str(e)}")
            continue


def process_name(soup):
    """Process the name to add gradient effect."""
    h1 = soup.find("h1")
    if h1 and h1.string:
        name_span = soup.new_tag("span")
        name_span.string = h1.string
        h1.string = ""
        h1.append(name_span)


async def create_styled_resume_async(input_path, output_path=None):
    """Create a styled PDF resume from a markdown input file."""
    # Read the markdown content
    with open(input_path, "r", encoding="utf-8") as file:
        md_content = file.read()

    # Remove YAML frontmatter (everything between --- markers at the start)
    md_content = re.sub(r"^---[\s\S]*?---\n*", "", md_content)

    # Add IDs to sections before removing emojis
    md_content = re.sub(
        r"^##.*Experience.*$",
        "## Experience {: #experience}",
        md_content,
        flags=re.MULTILINE,
    )
    md_content = re.sub(
        r"^##.*Summary.*$",
        "## Summary {: #summary}",
        md_content,
        flags=re.MULTILINE,
    )

    # Remove emojis
    md_content = remove_emojis(md_content)

    # Convert Markdown to HTML
    # Note: removed "nl2br" extension so text wraps naturally
    html_content = markdown.markdown(
        md_content, extensions=["tables", "attr_list"]
    )

    # Process the HTML content
    soup = BeautifulSoup(html_content, "html.parser")

    # Process name
    process_name(soup)

    # Process header section
    process_header_section(soup)

    # Process job entries
    process_job_entries(soup)

    # Process skills section - find all paragraphs under skills h3s
    skills_section_titles = [
        "Programming Languages",
        "Technical Expertise",
        "Engineering Leadership",
    ]

    for h3 in soup.find_all("h3"):
        if h3.text.strip() in skills_section_titles:
            # Process ALL sibling paragraphs until next h2/h3
            sibling = h3.find_next_sibling()
            while sibling and sibling.name not in ["h2", "h3"]:
                if sibling.name == "p":
                    process_skills_paragraph(sibling, soup)
                sibling = sibling.find_next_sibling()

    # Get the modified HTML content
    html_content = str(soup)

    # HTML template with CSS styling
    template = Template(
        """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @import url(
                'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap'
            );

            :root {
                --primary: #00a0a0;          /* Darker Cyan */
                --primary-light: rgba(0, 160, 160, 0.2);
                --secondary: #cc00cc;        /* Darker Magenta */
                --accent: #00a0a0;           /* Darker Cyan accent */
                --text-dark: #101018;        /* Near black text */
                --text-header: #00a0a0;      /* Cyan for headers */
                --text-subheader: #cc00cc;   /* Magenta for subheaders */
                --link-color: #008080;       /* Darker cyan for links */
                --background: #ffffff;       /* White background */
                --background-light: #f0f2f5; /* Light gray for sections */
                --body-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }

            body {
                font-family: var(--body-font);
                font-weight: 400;
                line-height: 1.3;
                max-width: 1000px;
                margin: 0 auto;
                padding: 1em;
                color: var(--text-dark);
                font-size: 9pt;
                background: var(--background);
            }

            /* Overridden by later h1 rule */

            h2 {
                color: var(--secondary);
                font-size: 1.4em;
                margin: 1.6em 0 0.8em 0;
                padding: 0.3em 0 0.3em 0.8em;
                border-left: 4px solid var(--secondary);
                background: none;
            }

            h2:first-of-type {
                margin-top: 1em;
            }

            h3 {
                color: var(--accent);
                font-size: 1.2em;
                margin: 1em 0 0.6em 0;
                padding: 0.3em 0.8em;
                border-bottom: 1px solid var(--primary-light);
            }

            /* Experience section styling */
            #experience ~ h3 {
                border-top: 1px solid var(--primary-light);
                background-color: var(--background-light);
            }

            /* Old skills styling removed - using .skill-tag class now */

            /* Links styling */
            a {
                color: var(--link-color);
                text-decoration: none;
                border-bottom: 1px dotted var(--link-color);
                padding-bottom: 1px;
            }
            
            a:hover {
                color: var(--secondary);
                border-bottom: 1px solid var(--secondary);
                text-decoration: none;
            }

            /* List styling */
            ul {
                list-style: none;
                margin: 0.6em 0 1em 0;
                padding: 0;
            }

            li {
                margin: 0.35em 0;
                line-height: 1.5;
                color: var(--text-dark);
                padding-left: 1.8em;
                position: relative;
                border-left: 2px solid var(--primary-light);
                margin-left: 0.5em;
            }

            li::before {
                content: "▹";
                position: absolute;
                left: 0.6em;
                color: var(--accent);
            }

            /* Technologies: lines - inline flow for links */
            li:has(strong:first-child) {
                border-left-color: var(--secondary);
            }

            /* Keep technology links inline */
            li a {
                white-space: nowrap;
            }

            /* Date styling */
            em {
                color: var(--primary);
            }

            /* Technologies emphasis */
            li strong {
                color: var(--secondary);
                font-weight: 600;
            }

            /* Summary section styling */
            #summary + p {
                margin-bottom: 1.5em;
            }

            #summary + p + p {
                margin-top: 1.5em;
                font-style: italic;
                color: var(--primary);
                text-shadow: 0 0 4px var(--primary-light);
            }

            /* Ensure header content is properly centered */
            .header-content {
                text-align: center !important;
                margin: 0.5em auto !important;
                width: 100% !important;
                display: block !important;
            }
            
            /* Style specifically for the links paragraph */
            .header-content a {
                display: inline-block;
                margin: 0 0.5em;
                color: var(--primary);
            }

            /* h1 styling moved to Name styling section below */

            /* Skills now use .skills-list class - see above */

            /* Job entry styling */
            h3 {
                color: var(--accent);
                font-size: 1.2em;
                margin-top: 1.2em;
                margin-bottom: 0.5em;
                padding: 0.3em 0;
                border-bottom: 1px solid var(--primary-light);
            }

            /* Role container */
            h4 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.8em 0 0.2em 0;
                padding: 0.2em 0;
            }

            /* Role title */
            h4 span:first-child {
                color: var(--secondary);
                font-size: 1.1em;
                font-weight: 600;
            }

            /* Convert h4 text to a flex container */
            h4::after {
                content: attr(data-date);
                color: var(--primary);
                font-size: 0.9em;
                font-style: italic;
                font-weight: normal;
            }

            /* Remove original date paragraph */
            h4 + p {
                display: none;
            }

            /* Role description bullets */
            ul {
                margin: 0.6em 0 1em 0.8em;
            }

            li {
                margin: 0.35em 0;
                line-height: 1.5;
                color: var(--text-dark);
            }

            /* Technologies emphasis */
            li strong {
                color: var(--secondary);
                font-weight: 600;
            }

            /* Employer section styling */
            #experience ~ h3 {
                color: var(--accent);
                font-size: 1.1em;
                margin: 1em 0 0.6em 0;
                padding: 0.2em 0.6em;
                background: none;
                border-left: 3px solid var(--accent);
                font-weight: 500;
                letter-spacing: 0.02em;
            }

            /* Role content indentation */
            #experience ~ h3 ~ h4,
            #experience ~ h3 ~ p,
            #experience ~ h3 ~ ul {
                margin-left: 1em;
            }

            /* Special styling for the first employer */
            h3:first-of-type {
                margin-top: 0.6em;
            }

            /* Add a subtle line between employers */
            h3:not(:first-of-type) {
                border-top: 1px solid rgba(0, 255, 255, 0.1);
                padding-top: 0.4em;
            }

            /* Name styling - gradient background bar */
            h1 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-size: 2.2em;
                text-align: center;
                margin: 0.5em 0;
                padding: 0.5em 1em;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                background: linear-gradient(90deg, #00a0a0 0%, #8800aa 50%, #cc00cc 100%);
                color: #ffffff;
                border-radius: 6px;
                font-weight: 600;
            }

            /* Name text styling - no background */
            h1 span {
                color: #ffffff;
                font-weight: 600;
                background: transparent;
            }

            /* Summary section */
            #summary + p {
                text-align: justify;
                line-height: 1.5;
                margin: 0.8em 0;
            }

            /* Skills list styling */
            .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.4em;
                align-items: center;
                margin: 0.5em 0;
                padding-left: 1.2em;
            }

            .skill-category {
                font-weight: 600;
                color: var(--secondary);
                margin-right: 0.3em;
                white-space: nowrap;
                width: 100%;
                padding-left: 0;
                margin-left: -1.2em;
                margin-top: 0.3em;
            }

            .skill-category:first-child {
                margin-top: 0;
            }

            .skill-tag {
                display: inline-block;
                background: var(--background-light);
                border: 1px solid var(--primary-light);
                padding: 0.15em 0.5em;
                border-radius: 4px;
                font-size: 0.9em;
                color: var(--text-dark);
                text-decoration: none;
            }

            a.skill-tag {
                border-bottom: none;
            }

            /* Experience section indentation */
            /* Only indent content under h3 (employers) */
            #experience ~ h3 ~ h4,
            #experience ~ h3 ~ p,
            #experience ~ h3 ~ ul {
                margin-left: 1.2em;
            }

            /* Keep employers (h3) and section headers (h2) at full width */
            #experience ~ h2,
            #experience ~ h3 {
                margin-left: 0;
            }

            /* Adjust employer headers styling */
            #experience ~ h3 {
                width: 100%;  /* Full width for employers */
            }
        </style>
    </head>
    <body>
        {{ content }}
    </body>
    </html>
    """  # noqa: E501
    )

    # Render the template
    html_output = template.render(content=html_content)

    # Generate output path
    if output_path is None:
        # Find project root by looking for public/ directory
        # Start from input file's directory and walk up
        current_dir = os.path.dirname(os.path.abspath(input_path))
        output_dir = None
        for _ in range(5):  # Look up to 5 levels
            potential_public = os.path.join(current_dir, "public")
            if os.path.isdir(potential_public):
                output_dir = potential_public
                break
            parent = os.path.dirname(current_dir)
            if parent == current_dir:  # Reached root
                break
            current_dir = parent

        if output_dir is None:
            # Fallback: create public/ next to input file
            output_dir = os.path.join(os.path.dirname(input_path), "public")

        # Create public directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base_name}.pdf")

    # Convert HTML to PDF using Playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Write HTML to a temp file for proper file:// URL loading
        with tempfile.NamedTemporaryFile(mode="w", suffix=".html", delete=False) as f:
            f.write(html_output)
            temp_html_path = f.name

        try:
            await page.goto(f"file://{temp_html_path}")
            await page.pdf(
                path=output_path,
                format="Letter",
                margin={"top": "0.5in", "bottom": "0.5in", "left": "0.5in", "right": "0.5in"},
                print_background=True,
            )
        finally:
            os.unlink(temp_html_path)
            await browser.close()

    print(f"PDF generated: {output_path}")


def create_styled_resume(input_path, output_path=None):
    """Sync wrapper for create_styled_resume_async."""
    asyncio.run(create_styled_resume_async(input_path, output_path))


def main():
    """Main function to parse arguments and generate the PDF resume."""
    parser = argparse.ArgumentParser(description="Convert markdown resume to PDF")
    parser.add_argument("input_file", help="Path to the markdown resume file")
    parser.add_argument(
        "-o",
        "--output",
        help="Output path for the PDF file (default: public/[input_name].pdf)",
        default=None,
    )
    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: File not found: {args.input_file}")
        return 1

    try:
        create_styled_resume(args.input_file, args.output)
        return 0
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
