import { validateImage as browserValidateImage } from 'browser-image-validator';
import {
  ImageTooLargeError,
  ImageTypeError,
  ImageWidthTooLargeError,
  ImageHeightTooLargeError,
  ImageLoadError,
} from '../errors/ImageErrors';
import { APP_CONFIG } from '../../app/config/app';

export async function validateImage(file: File): Promise<void> {
  const maxSizeBytes = APP_CONFIG.GAME.MAX_UPLOAD_FILE_SIZE_BYTES;

  const maxDimension = APP_CONFIG.GAME.MAX_IMAGE_DIMENSION;

  if (!file.type.startsWith('image/')) {
    throw new ImageTypeError();
  }

  const result = await browserValidateImage(file, {
    maxFileSizeBytes: maxSizeBytes,
    dimensions: {
      maxWidth: maxDimension,
      maxHeight: maxDimension,
    },
  });

  if (!result.valid) {
    const firstError = result.errors[0];

    switch (firstError.code) {
      case 'FILE_TOO_LARGE':
        throw new ImageTooLargeError(Math.round(maxSizeBytes / (1024 * 1024)));
      case 'IMAGE_WIDTH_TOO_LARGE':
        throw new ImageWidthTooLargeError(maxDimension);
      case 'IMAGE_HEIGHT_TOO_LARGE':
        throw new ImageHeightTooLargeError(maxDimension);
      case 'IMAGE_LOAD_FAILED':
        throw new ImageLoadError();
      default:
        throw new ImageLoadError();
    }
  }
}
