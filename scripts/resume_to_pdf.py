#!/usr/bin/env python3
"""Module to convert a markdown resume to a styled PDF."""

import argparse
import os
import re
import sys

import emoji
import markdown
import weasyprint
from bs4 import BeautifulSoup
from jinja2 import Template


def remove_emojis(text):
    """Remove emojis from the given text."""
    return emoji.replace_emoji(text, replace="")


def process_paragraph_contents(p, soup):
    """Process paragraph contents to wrap non-link text in spans."""
    items = []
    for content in p.contents:
        if isinstance(content, str):
            parts = content.split("|")
            for part in parts:
                part = part.strip()
                if part:
                    items.append(part)
        elif content.name == "a":
            items.append(content)
    p.clear()
    for item in items:
        if isinstance(item, str):
            span = soup.new_tag("span")
            span.string = item
            p.append(span)
        else:
            p.append(item)
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


def create_styled_resume(input_path, output_path=None):
    """Create a styled PDF resume from a markdown input file."""
    # Read the markdown content
    with open(input_path, "r", encoding="utf-8") as file:
        md_content = file.read()

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
    html_content = markdown.markdown(
        md_content, extensions=["tables", "nl2br", "attr_list"]
    )

    # Process the HTML content
    soup = BeautifulSoup(html_content, "html.parser")

    # Process name
    process_name(soup)

    # Process header section
    process_header_section(soup)

    # Process job entries
    process_job_entries(soup)

    # Process skills section
    skills_section_titles = [
        "Programming Languages",
        "Technical Expertise",
        "Engineering Leadership",
    ]

    for h3 in soup.find_all("h3"):
        if h3.text.strip() in skills_section_titles:
            p = h3.find_next_sibling("p")
            if p:
                process_paragraph_contents(p, soup)

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
                --primary: #00ffff;          /* Cyan */
                --primary-light: rgba(0, 255, 255, 0.2);
                --secondary: #ff00ff;        /* Magenta */
                --accent: #00ffff;           /* Cyan accent */
                --text-light: #ffffff;       /* White text */
                --text-header: #00ffff;      /* Cyan for headers */
                --text-subheader: #ff00ff;   /* Magenta for subheaders */
                --link-color: #00cccc;       /* Darker cyan for links */
                --background: #1a1b25;       /* Dark background */
                --background-light: #2d2e3d; /* Slightly lighter background for sections */
                --body-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }

            body {
                font-family: var(--body-font);
                font-weight: 400;
                line-height: 1.3;
                max-width: 1000px;
                margin: 0 auto;
                padding: 1em;
                color: var(--text-light);
                font-size: 9pt;
                background: var(--background);
            }

            h1 {
                color: var(--text-header);
                text-shadow: 0 0 10px var(--primary);
            }

            h2 {
                color: var(--secondary);
                font-size: 1.4em;
                margin: 1.6em 0 0.8em 0;
                padding: 0.3em 0 0.3em 1em;
                position: relative;
                background: linear-gradient(
                    to right,
                    rgba(255, 0, 255, 0.1),
                    transparent 85%
                );
                border-radius: 0 4px 4px 0;
            }

            h2::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(
                    to bottom,
                    var(--secondary),
                    var(--primary)
                );
                border-radius: 2px;
                box-shadow: 
                    0 0 10px var(--secondary),
                    0 0 20px var(--primary);
            }

            h2:first-of-type {
                margin-top: 1em;
            }

            h3 {
                color: var(--accent);
                text-shadow: 0 0 6px var(--primary);
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

            /* Skills section styling - removed borders, simplified */
            h3 + p a,
            h3 + p span {
                background: var(--background-light);
                padding: 0.2em 0.5em;
                border-radius: 3px;
                margin: 0.1em;
                color: var(--text-light);
                transition: all 0.2s ease;
            }

            h3 + p a:hover,
            h3 + p span:hover {
                background: rgba(0, 255, 255, 0.1);
                transform: translateY(-1px);
                text-shadow: 0 0 8px var(--primary);
            }

            /* Links styling */
            a {
                color: var(--primary);
                text-decoration: none;
            }
            
            a:hover {
                color: var(--secondary);
                text-decoration: none;
                text-shadow: 0 0 8px var(--secondary);
            }

            /* List styling */
            ul {
                list-style: none;
                margin: 0.8em 0 1.2em 0;
                padding: 0;
            }

            li {
                margin: 0.3em 0;
                line-height: 1.3;
                color: var(--text-light);
                padding-left: 2em;
                position: relative;
            }

            li::before {
                content: "▹";
                position: absolute;
                left: 0.8em;
                color: var(--accent);
                text-shadow: 0 0 4px var(--accent);
            }

            /* Add a subtle left border for list items */
            li {
                border-left: 2px solid var(--primary-light);
                margin-left: 0.5em;
                padding-left: 1.5em;
                transition: border-color 0.2s ease;
            }

            li:hover {
                border-left-color: var(--accent);
            }

            /* Make Technologies: lines stand out */
            li:has(strong:first-child) {
                border-left-color: var(--secondary);
                background: linear-gradient(
                    to right,
                    rgba(255, 0, 255, 0.05),
                    transparent 50%
                );
            }

            /* Date styling */
            em {
                color: var(--primary);
            }

            /* Technologies emphasis */
            li strong {
                color: var(--secondary);
                text-shadow: 0 0 4px var(--secondary);
            }

            /* Summary section spacing */
            #summary + p {
                margin-bottom: 1.5em;
            }

            #summary + p + p {
                margin-top: 1.5em;
                font-style: italic;
                color: var(--primary);
                text-shadow: 0 0 6px var(--primary);
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

            /* Center the title */
            h1 {
                text-align: center;
                color: var(--text-header);
                text-shadow: 0 0 10px var(--primary);
                margin-bottom: 0.2em;
            }

            /* Skills section container */
            h3 + p {
                display: flex;
                flex-wrap: wrap;
                gap: 0.6em;
                margin: 0.8em 0;
                line-height: 1.6;
            }

            /* Individual skill items */
            h3 + p a,
            h3 + p span {
                background: var(--background-light);
                padding: 0.3em 0.6em;
                border-radius: 3px;
                color: var(--text-light);
                transition: all 0.2s ease;
                white-space: nowrap;
                display: inline-block;
                font-size: 0.9em;
                line-height: 1.2;
            }

            h3 + p a:hover,
            h3 + p span:hover {
                background: rgba(0, 255, 255, 0.1);
                transform: translateY(-1px);
                text-shadow: 0 0 8px var(--primary);
            }

            /* Job entry styling */
            h3 {
                color: var(--accent);
                text-shadow: 0 0 6px var(--primary);
                font-size: 1.4em;
                margin-top: 1.5em;
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
                text-shadow: 0 0 4px var(--secondary);
                font-weight: 600;
            }

            /* Convert h4 text to a flex container */
            h4::after {
                content: attr(data-date);
                color: var(--primary);
                font-size: 0.9em;
                font-style: italic;
                font-weight: normal;
                text-shadow: 0 0 4px var(--primary);
            }

            /* Remove original date paragraph */
            h4 + p {
                display: none;
            }

            /* Role description bullets */
            ul {
                margin: 0.8em 0 1.2em 1.2em;
            }

            li {
                margin: 0.4em 0;
                line-height: 1.4;
                color: var(--text-light);
            }

            li::marker {
                color: var(--accent);
                text-shadow: 0 0 4px var(--accent);
            }

            /* Technologies emphasis */
            li strong {
                color: var(--secondary);
                text-shadow: 0 0 4px var(--secondary);
                font-weight: 600;
            }

            /* Employer section styling */
            #experience ~ h3 {
                color: var(--accent);
                text-shadow: 0 0 4px var(--primary);
                font-size: 1.1em;
                margin: 1em 0 0.6em 0;
                padding: 0.2em 0.6em;
                background: linear-gradient(
                    to right,
                    rgba(0, 255, 255, 0.08),
                    transparent 80%
                );
                border-left: 2px solid var(--accent);
                border-radius: 0 3px 3px 0;
                position: relative;
                width: auto;
                box-sizing: border-box;
                margin-right: 0;
                font-weight: 500;
                letter-spacing: 0.02em;
            }

            /* Hover effect for employer headers */
            #experience ~ h3:hover {
                background: linear-gradient(
                    to right,
                    rgba(0, 255, 255, 0.1),
                    transparent 80%
                );
            }

            /* Role content indentation */
            #experience ~ h3 ~ h4,
            #experience ~ h3 ~ p,
            #experience ~ h3 ~ ul {
                margin-left: 1.2em;
                margin-right: 0;
                width: auto;
                box-sizing: border-box;
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

            /* Name styling */
            h1 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-size: 2em;
                text-align: center;
                margin: 0.6em 0;
                padding: 0.3em;
                position: relative;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }

            /* Name text styling */
            h1 span {
                color: #ffffff;
                text-shadow: 
                    0 0 1px #fff,
                    0 0 8px var(--primary),
                    0 0 15px var(--primary);
                font-weight: 600;
                position: relative;
                z-index: 2;
            }

            /* Decorative bar behind name */
            h1::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    90deg,
                    #00ffff,
                    #ff00ff
                );
                opacity: 0.7;
                border-radius: 6px;
                z-index: 1;
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
        # Default to public/ directory
        output_dir = os.path.join(
            os.path.dirname(os.path.dirname(input_path)), "public"
        )
        # Create public directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base_name}.pdf")

    # Convert HTML to PDF
    pdf = weasyprint.HTML(string=html_output).write_pdf()

    # Save the PDF
    with open(output_path, "wb") as file:
        file.write(pdf)

    print(f"PDF generated: {output_path}")


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
