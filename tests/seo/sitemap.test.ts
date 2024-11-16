import { getAllMarkdownSlugs } from "@/lib/markdown";
import { GET } from "@/sitemap.xml/route";

// Mock the markdown functions
jest.mock("@/lib/markdown", () => ({
  getAllMarkdownSlugs: jest.fn(),
}));

describe("Sitemap Generation", () => {
  beforeEach(() => {
    // Mock return values for getAllMarkdownSlugs
    (getAllMarkdownSlugs as jest.Mock)
      .mockResolvedValueOnce(["post-1", "post-2"]) // Blog posts
      .mockResolvedValueOnce(["project-1"]); // Projects
  });

  it("should generate valid sitemap XML", async () => {
    const response = await GET();
    const content = await response.text();

    // Check content type
    expect(response.headers.get("Content-Type")).toBe("application/xml");

    // Check XML structure
    expect(content).toMatch(/<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(content).toMatch(
      /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/
    );

    // Check static pages
    expect(content).toMatch(/<loc>https:\/\/hyperbliss.tech<\/loc>/);
    expect(content).toMatch(/<loc>https:\/\/hyperbliss.tech\/about<\/loc>/);
    expect(content).toMatch(/<loc>https:\/\/hyperbliss.tech\/blog<\/loc>/);
    expect(content).toMatch(/<loc>https:\/\/hyperbliss.tech\/projects<\/loc>/);

    // Check dynamic pages
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/blog\/post-1<\/loc>/
    );
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/blog\/post-2<\/loc>/
    );
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/projects\/project-1<\/loc>/
    );

    // Check required elements
    expect(content).toMatch(/<lastmod>/);
    expect(content).toMatch(/<changefreq>/);
    expect(content).toMatch(/<priority>/);
  });

  it("should set correct priorities for different page types", async () => {
    const response = await GET();
    const content = await response.text();

    // Home page should have highest priority
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech<\/loc>[^]*?<priority>1<\/priority>/
    );

    // Blog and Projects index pages should have high priority
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/blog<\/loc>[^]*?<priority>0.9<\/priority>/
    );
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/projects<\/loc>[^]*?<priority>0.9<\/priority>/
    );

    // Individual blog posts should have medium priority
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/blog\/post-1<\/loc>[^]*?<priority>0.7<\/priority>/
    );
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/blog\/post-2<\/loc>[^]*?<priority>0.7<\/priority>/
    );

    // Project pages should have medium-high priority
    expect(content).toMatch(
      /<loc>https:\/\/hyperbliss.tech\/projects\/project-1<\/loc>[^]*?<priority>0.8<\/priority>/
    );
  });
});
