// tests/utils/ColorManager.test.ts
import { ColorManager } from "@/cyberscape/utils/ColorManager";

describe("ColorManager", () => {
  describe("getRandomCyberpunkHue", () => {
    it("should return a number between 0 and 360", () => {
      const hue = ColorManager.getRandomCyberpunkHue();
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThanOrEqual(360);
    });
  });

  describe("isValidCyberpunkHue", () => {
    it("should return true for valid cyberpunk hues", () => {
      expect(ColorManager.isValidCyberpunkHue(200)).toBe(true);
      expect(ColorManager.isValidCyberpunkHue(300)).toBe(true);
    });

    it("should return false for invalid cyberpunk hues", () => {
      expect(ColorManager.isValidCyberpunkHue(0)).toBe(false);
      expect(ColorManager.isValidCyberpunkHue(360)).toBe(false);
    });
  });

  describe("hexToRgb", () => {
    it("should correctly convert hex to RGB", () => {
      expect(ColorManager.hexToRgb("#ff00ff")).toEqual({ r: 255, g: 0, b: 255 });
      expect(ColorManager.hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
    });

    it("should return null for invalid hex values", () => {
      expect(ColorManager.hexToRgb("invalid")).toBeNull();
    });
  });
});
