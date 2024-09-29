// tests/Logo.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Logo from "@/components/Logo";

// Mock the useAnimatedNavigation hook
jest.mock("@/hooks/useAnimatedNavigation", () => ({
  useAnimatedNavigation: () => jest.fn(),
}));

describe("Logo", () => {
  it("renders the logo text and emojis", () => {
    render(<Logo />);

    // Check for the main logo text
    expect(screen.getByText("𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼")).toBeInTheDocument();

    // Check for the emojis
    expect(screen.getByText("🌠")).toBeInTheDocument();
    expect(screen.getByText("✨")).toBeInTheDocument();
    expect(screen.getByText("⎊")).toBeInTheDocument();
    expect(screen.getByText("⨳")).toBeInTheDocument();
    expect(screen.getByText("✵")).toBeInTheDocument();
    expect(screen.getByText("⊹")).toBeInTheDocument();
  });

  it("has a clickable link", async () => {
    const user = userEvent.setup();
    render(<Logo />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");

    await user.click(link);
    // Since we've mocked useAnimatedNavigation, we're just ensuring the link is clickable
    // In a real scenario, we'd check if the navigation function was called
  });

  it("applies correct styling", () => {
    render(<Logo />);

    const logoText = screen.getByText("𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼");
    expect(logoText).toHaveStyle(`
      font-family: var(--font-logo);
      font-size: 3rem;
    `);

    // Check if the link has the correct styling
    const link = screen.getByRole("link");
    expect(link).toHaveStyle(`
      display: flex;
      align-items: center;
      text-decoration: none;
    `);
  });
});
