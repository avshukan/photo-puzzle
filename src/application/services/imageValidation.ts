import {
  ImageTooLargeError,
  ImageWidthTooLargeError,
  ImageHeightTooLargeError,
} from '../errors/ImageErrors';
import { APP_CONFIG } from '../../app/config/app';

export async function validateImage(file: File): Promise<void> {
  const maxSizeBytes = APP_CONFIG.GAME.MAX_FILE_SIZE_BYTES;

  const maxDimension = APP_CONFIG.GAME.MAX_IMAGE_DIMENSION;

  const loadTimeoutMs = 3000;

  // 1. File size
  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));

    throw new ImageTooLargeError(maxMb);
  }

  // 2. Image resolution
  const img = new Image();

  const url = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error('Image load timeout')),
        loadTimeoutMs,
      );

      img.onload = () => {
        clearTimeout(timeoutId);

        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeoutId);

        reject(new Error('Failed to load image'));
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
    URL.revokeObjectURL(url);
  }
}
