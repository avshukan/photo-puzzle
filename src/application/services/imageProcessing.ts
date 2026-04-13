import { ImageLoadError } from '../errors/ImageErrors';
import { APP_CONFIG } from '../../app/config/app';

export const NORMALIZATION_MAX_DIMENSION = 1024;
export const NORMALIZATION_MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1MB
export const NORMALIZATION_JPEG_QUALITY = 0.75;
export const IMAGE_LOAD_TIMEOUT_MS = APP_CONFIG.GAME.IMAGE_LOAD_TIMEOUT_MS;

export type ImageDimensions = Readonly<{
  width: number;
  height: number;
}>;

export type ImageTransformOptions = Readonly<{
  maxDimension: number;
  quality: number;
}>;

export type ProcessedImage = Readonly<{
  dataUrl: string;
  width: number;
  height: number;
  wasTransformed: boolean;
}>;

export async function processImage(file: File): Promise<ProcessedImage> {
  const dimensions = await readImageDimensions(file);

  if (!shouldNormalize(file, dimensions)) {
    const dataUrl = await readFileAsDataUrl(file);

    return {
      dataUrl,
      width: dimensions.width,
      height: dimensions.height,
      wasTransformed: false,
    };
  }

  return transformImage(file, {
    maxDimension: NORMALIZATION_MAX_DIMENSION,
    quality: NORMALIZATION_JPEG_QUALITY,
  });
}

export function shouldNormalize(
  file: File,
  dimensions: ImageDimensions,
): boolean {
  return !(
    file.size <= NORMALIZATION_MAX_FILE_SIZE_BYTES &&
    dimensions.width <= NORMALIZATION_MAX_DIMENSION &&
    dimensions.height <= NORMALIZATION_MAX_DIMENSION
  );
}

export async function readImageDimensions(
  file: File,
): Promise<ImageDimensions> {
  const image = new Image();
  const url = URL.createObjectURL(file);

  try {
    await loadImage(image, url);

    return {
      width: image.width,
      height: image.height,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function transformImage(
  file: File,
  options: ImageTransformOptions,
): Promise<ProcessedImage> {
  const image = new Image();
  const url = URL.createObjectURL(file);

  try {
    await loadImage(image, url);

    const target = calculateTargetDimensions(
      {
        width: image.width,
        height: image.height,
      },
      options.maxDimension,
    );

    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new ImageLoadError();
    }

    context.drawImage(image, 0, 0, target.width, target.height);

    const dataUrl = canvas.toDataURL('image/jpeg', options.quality);

    return {
      dataUrl,
      width: target.width,
      height: target.height,
      wasTransformed: true,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function calculateTargetDimensions(
  dimensions: ImageDimensions,
  maxDimension: number,
): ImageDimensions {
  const { width, height } = dimensions;

  if (width <= maxDimension && height <= maxDimension) {
    return dimensions;
  }

  if (width >= height) {
    const nextWidth = maxDimension;
    const nextHeight = Math.round((height / width) * maxDimension);

    return {
      width: nextWidth,
      height: nextHeight,
    };
  }

  const nextHeight = maxDimension;
  const nextWidth = Math.round((width / height) * maxDimension);

  return {
    width: nextWidth,
    height: nextHeight,
  };
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new ImageLoadError());
    };

    reader.onerror = () => {
      reject(new ImageLoadError());
    };

    reader.readAsDataURL(file);
  });
}

async function loadImage(image: HTMLImageElement, src: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new ImageLoadError()),
      IMAGE_LOAD_TIMEOUT_MS,
    );

    image.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    image.onerror = () => {
      clearTimeout(timeoutId);
      reject(new ImageLoadError());
    };

    image.src = src;
  });
}
