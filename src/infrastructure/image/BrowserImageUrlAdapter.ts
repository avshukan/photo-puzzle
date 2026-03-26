import type { ImageUrlPort, ImageUrl } from '../../application';
import defaultImage from '../../assets/default.jpg';

export class BrowserImageUrlAdapter implements ImageUrlPort {
  getDefaultImageUrl(): ImageUrl {
    return defaultImage;
  }

  readAsDataUrl(file: File): Promise<ImageUrl> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
