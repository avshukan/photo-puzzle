import type { ImageUrlPort, ImageUrl } from '../../application';
import defaultImage from '../../assets/default.jpg';

export class BrowserImageUrlAdapter implements ImageUrlPort {
  getDefaultImageUrl(): ImageUrl {
    return defaultImage;
  }

  createObjectUrl(file: File): ImageUrl {
    return URL.createObjectURL(file);
  }

  revokeObjectUrl(url: ImageUrl): void {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
}
