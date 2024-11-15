#!/usr/bin/env python3
"""Module to convert a markdown resume to a styled PDF."""

import os
import re
import sys
import argparse

import markdown
import weasyprint
from jinja2 import Template
import emoji
from bs4 import BeautifulSoup


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


def create_styled_resume(input_path):
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

    # Remove emojis
    md_content = remove_emojis(md_content)

    # Convert Markdown to HTML
    html_content = markdown.markdown(
        md_content, extensions=["tables", "nl2br", "attr_list"]
    )

    # Process the HTML content to wrap non-link text in spans in the skills section
    soup = BeautifulSoup(html_content, "html.parser")

    # Define the skills section titles
    skills_section_titles = [
        "Programming Languages",
        "Technical Expertise",
        "Engineering Leadership",
    ]

    for h3 in soup.find_all("h3"):
        if h3.text.strip() in skills_section_titles:
            # Get the next sibling, which should be the paragraph with the skills
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
                --primary: #6600cc;
                --primary-light: rgba(102, 0, 204, 0.2);
                --accent: #ff66b3;
                --text-dark: #1a1b25;
                --text-header: #2d1b4d;
                --text-subheader: #4a1b6c;
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
                font-size: 10.5pt;
                background: linear-gradient(
                    to bottom right,
                    rgba(102, 0, 204, 0.02),
                    rgba(255, 102, 179, 0.02)
                );
            }

            /* Make body text slightly crisper */
            p, li {
                font-weight: 400;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            /* Make bold text stand out more */
            strong {
                font-weight: 600;
            }

            h1 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-weight: 600;
                color: var(--text-header);
                font-size: 1.9em;
                margin-bottom: 0.2em;
                border-bottom: 2px solid;
                border-image: linear-gradient(to right, var(--accent), var(--primary)) 1;
                padding-bottom: 0.1em;
                text-align: center;
                letter-spacing: 0.05em;
                text-shadow: 2px 2px 4px rgba(102, 0, 204, 0.1);
            }

            h2 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-weight: 500;
                color: var(--text-subheader);
                font-size: 1.45em;
                margin-top: 1.2em;
                margin-bottom: 0.4em;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                background: linear-gradient(
                    to right,
                    var(--primary-light),
                    transparent
                );
                padding: 0.3em;
                border-radius: 3px;
            }

            h3 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-weight: 500;
                color: var(--primary);
                font-size: 1.25em;
                margin-top: 0.6em;
                margin-bottom: 0.1em;
            }

            /* Experience section styling */
            #experience + h3,
            #experience ~ h3 {
                margin-top: 1.2em;
                margin-bottom: 0.3em;
                padding-top: 0.5em;
                padding-bottom: 0.2em;
                border-top: 1px solid rgba(102, 0, 204, 0.2);
                background-color: rgba(102, 0, 204, 0.03);
                padding-left: 0.3em;
            }
            
            #experience + h3 {
                border-top: none;
                margin-top: 0.8em;
            }
            
            h4 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-weight: 500;
                color: var(--text-subheader);
                font-size: 1.15em;
                margin-top: 0.4em;
                margin-bottom: 0.1em;
                font-style: normal;
                padding-left: 0.8em;
                position: relative;
            }

            /* Add subtle highlight to role names */
            h4::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 0.3em;
                height: 0.3em;
                background: linear-gradient(to right, var(--accent), var(--primary));
                border-radius: 50%;
            }

            /* Style the date/duration differently */
            h4 + p {
                font-style: italic;
                color: var(--primary);
                font-size: 0.975em;
                padding-left: 0.8em;
                margin-top: 0;
                opacity: 0.8;
            }

            p {
                margin: 0.2em 0;
                padding-left: 0.3em;
            }
            
            a {
                color: #9933ff;
                text-decoration: none;
                transition: color 0.2s ease;
            }
            
            a:hover {
                color: #ff66b3;
                text-decoration: none;
                border-bottom: 1px dotted #ff66b3;
            }
            
            ul {
                margin: 0.2em 0;
                padding-left: 1.3em;
            }
            
            li {
                margin: 0.15em 0;
                line-height: 1.2;
                position: relative;
            }

            li::marker {
                color: var(--primary);
            }

            /* Style for contact information */
            p:nth-of-type(1) {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                text-align: center;
                margin: 0.5em 0;
                font-size: 1.05em;
                color: #6600cc;
                padding-left: 0;
                letter-spacing: 0.02em;
            }
            
            /* Style for skills section */
            h3 + p {
                display: flex;
                flex-wrap: wrap;
                gap: 0.3em;
            }

            h3 + p a,
            h3 + p span {
                background: rgba(102, 0, 204, 0.05);
                padding: 0.2em 0.5em;
                border-radius: 3px;
                margin: 0.1em;
                transition: all 0.2s ease;
                border: 1px solid transparent;
                text-decoration: none;
                color: inherit;
                font-size: 10.5pt;
            }

            h3 + p a:hover,
            h3 + p span:hover {
                background: rgba(102, 0, 204, 0.1);
                border: 1px solid var(--primary-light);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(102, 0, 204, 0.1);
            }

            /* Ensure consistent font style */
            h3 + p a,
            h3 + p span {
                font-family: var(--body-font);
                font-size: 10.5pt;
            }

            /* Experience section enhancements */
            #experience ~ h3 {
                margin-top: 1em;      /* Reduced from 1.2em */
                margin-bottom: 0.3em;  /* Reduced from 0.4em */
                padding: 0.3em 0.5em;  /* Reduced top/bottom padding from 0.4em */
                background: linear-gradient(
                    to right,
                    rgba(102, 0, 204, 0.03),
                    transparent 80%
                );
                border-radius: 2px;
                border-left: 2px solid var(--primary-light);
                position: relative;
            }

            #experience ~ h3:first-of-type {
                margin-top: 0.4em;  /* Reduced from 0.6em */
            }

            /* Tighter role title spacing */
            h4 {
                margin-top: 0.6em;    /* Reduced from 0.8em */
                margin-bottom: 0.1em;
                padding-left: 0.8em;
            }

            /* Ensure content under employer aligns properly */
            #experience ~ h3 + h4,
            #experience ~ h3 + h4 + p,
            #experience ~ h3 + h4 + p + ul {
                padding-left: 0.8em;
            }

            /* Date styling */
            em {
                color: var(--primary);
                font-size: 0.95em;
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
            }

            /* Technologies emphasis */
            li strong {
                color: var(--text-subheader);
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                letter-spacing: 0.02em;
            }

            /* Contact info enhancement */
            p:nth-of-type(1) a {
                padding: 0.2em 0.4em;
                border-radius: 3px;
                transition: all 0.2s ease;
            }

            p:nth-of-type(1) a:hover {
                background: rgba(102, 0, 204, 0.05);
                transform: translateY(-1px);
            }

            /* Section headers enhancement */
            h2 {
                font-family: 'Space Grotesk', 'Outfit', sans-serif;
                font-weight: 500;
                color: var(--text-subheader);
                font-size: 1.3em;
                margin-top: 1.2em;
                margin-bottom: 0.4em;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                background: linear-gradient(
                    to right,
                    var(--primary-light),
                    transparent
                );
                padding: 0.3em;
                border-radius: 3px;
            }

            @page {
                margin: 1cm;
                @bottom-right {
                    content: counter(page);
                    font-family: 'Space Grotesk', 'Outfit', sans-serif;
                    font-size: 9.5pt;
                    color: var(--primary);
                }
            }

            /* Enhanced spacing for roles under employers */
            #experience ~ h3 {
                margin-top: 1.5em;  /* Increased space between employers */
                padding-top: 0.8em;
                border-top: 1px solid rgba(102, 0, 204, 0.2);
            }

            #experience ~ h3:first-of-type {
                margin-top: 0.8em;  /* Less space for first employer */
                border-top: none;
            }

            /* Role title spacing */
            h4 {
                margin-top: 1.2em;  /* Increased space between roles */
                margin-bottom: 0.3em;
                padding-left: 0.8em;
            }

            /* Role date spacing */
            h4 + p {
                margin-top: 0;
                margin-bottom: 0.4em;
            }

            /* Role description spacing */
            h4 + p + ul {
                margin-top: 0.3em;
                margin-bottom: 1.2em;  /* Space after role description */
            }

            /* Last role in each employer section */
            h3 ~ h3,
            h3:last-of-type {
                margin-bottom: 0.8em;
            }

            /* Bullet points in role descriptions */
            li {
                margin: 0.25em 0;  /* Increased space between bullet points */
                line-height: 1.4;  /* Slightly increased line height */
            }
        </style>
    </head>
    <body>
        {{ content }}
    </body>
    </html>
    """
    )

    # Render the template
    html_output = template.render(content=html_content)

    # Generate output path in same directory as input
    output_dir = os.path.dirname(input_path)
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
    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: File not found: {args.input_file}")
        return 1

    try:
        create_styled_resume(args.input_file)
        return 0
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
