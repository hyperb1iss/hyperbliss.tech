export type ScreenSize = "mobile" | "desktop" | "widescreen";

/**
 * Class to manage screen size detection.
 */
export class ScreenSizeManager {
  private static readonly MOBILE_THRESHOLD = 768;
  private static readonly WIDESCREEN_THRESHOLD = 1440;

  public static getScreenSize(width: number, _height: number): ScreenSize {
    const isLowEndDevice = this.isLowEndDevice();

    if (isLowEndDevice || width <= this.MOBILE_THRESHOLD) {
      return "mobile";
    } else if (width >= this.WIDESCREEN_THRESHOLD) {
      return "widescreen";
    } else {
      return "desktop";
    }
  }

  private static isLowEndDevice(): boolean {
    interface NavigatorWithMemory extends Navigator {
      deviceMemory?: number;
    }

    const nav = navigator as NavigatorWithMemory;

    if ("deviceMemory" in nav && nav.deviceMemory) {
      if (nav.deviceMemory < 4) return true;
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    return isMobile;
  }
}
