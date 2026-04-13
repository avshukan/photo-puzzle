import {
  ImageTooLargeError,
  ImageTypeError,
  ImageWidthTooLargeError,
  ImageHeightTooLargeError,
  ImageLoadError,
} from '../errors/ImageErrors';
import { APP_CONFIG } from '../../app/config/app';

export const IMAGE_LOAD_TIMEOUT_MS = APP_CONFIG.GAME.IMAGE_LOAD_TIMEOUT_MS;

export async function validateImage(file: File): Promise<void> {
  const maxSizeBytes = APP_CONFIG.GAME.MAX_UPLOAD_FILE_SIZE_BYTES;

  const maxDimension = APP_CONFIG.GAME.MAX_IMAGE_DIMENSION;

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));

    throw new ImageTooLargeError(maxMb);
  }

  if (!file.type.startsWith('image/')) {
    throw new ImageTypeError();
  }

  const img = new Image();

  let url = '';

  try {
    url = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new ImageLoadError()),
        IMAGE_LOAD_TIMEOUT_MS,
      );

      img.onload = () => {
        clearTimeout(timeoutId);

        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeoutId);

        reject(new ImageLoadError());
      };

      img.src = url;
    });

    if (img.width > maxDimension) {
      throw new ImageWidthTooLargeError(maxDimension);
    }

    if (img.height > maxDimension) {
      throw new ImageHeightTooLargeError(maxDimension);
    }
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}
