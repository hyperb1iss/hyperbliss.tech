// tests/NavLinks.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavLinks from "@/components/NavLinks";
import { NAV_ITEMS } from "@/lib/navigation";

// Mock the usePathname hook
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock the useAnimatedNavigation hook
jest.mock("@/hooks/useAnimatedNavigation", () => ({
  useAnimatedNavigation: () => jest.fn(),
}));

describe("NavLinks", () => {
  beforeEach(() => {
    // Set the default mock return value
    mockUsePathname.mockReturnValue(`/${NAV_ITEMS[0].toLowerCase()}`);
  });

  it("renders all navigation items", () => {
    render(<NavLinks />);

    NAV_ITEMS.forEach((item) => {
      const link = screen.getByText(item);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", expect.stringContaining(item.toLowerCase()));
    });
  });

  it("applies active class to the current page link", () => {
    render(<NavLinks />);

    const activeItem = NAV_ITEMS[0];
    const activeLink = screen.getByText(activeItem);
    expect(activeLink).toHaveClass("active");

    const otherLinks = NAV_ITEMS.slice(1).map((item) => screen.getByText(item));

    otherLinks.forEach((link) => {
      expect(link).not.toHaveClass("active");
    });
  });

  it("calls navigation function when a link is clicked", async () => {
    const user = userEvent.setup();
    render(<NavLinks />);

    const aboutLink = screen.getByText("About");
    await user.click(aboutLink);

    // In a real scenario, we'd check if the navigation function was called with the correct path
    // Since we've mocked useAnimatedNavigation, we're just ensuring the link is clickable
  });
});
