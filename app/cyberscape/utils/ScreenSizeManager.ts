export type ScreenSize = 'mobile' | 'desktop' | 'widescreen';

/**
 * Class to manage screen size detection.
 */
export class ScreenSizeManager {
  private static readonly MOBILE_THRESHOLD = 768;
  private static readonly WIDESCREEN_THRESHOLD = 1920;

  public static getScreenSize(width: number, height: number): ScreenSize {
    if (width <= this.MOBILE_THRESHOLD) {
      return 'mobile';
    } else if (width >= this.WIDESCREEN_THRESHOLD && width / height >= 16 / 9) {
      return 'widescreen';
    } else {
      return 'desktop';
    }
  }
}
