import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  processImage,
  shouldNormalize,
  readImageDimensions,
  transformImage,
  calculateTargetDimensions,
  NORMALIZATION_MAX_DIMENSION,
  NORMALIZATION_MAX_FILE_SIZE_BYTES,
} from './imageProcessing';
import { ImageLoadError } from '../errors/ImageErrors';

function createFile(
  size: number,
  name: string = 'test.jpg',
  type: string = 'image/jpeg',
): File {
  return new File([new Uint8Array(size)], name, { type });
}

function mockImageLoad(width: number, height: number) {
  const originalImage = globalThis.Image;

  class MockImage {
    width = width;
    height = height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    set src(_value: string) {
      setTimeout(() => {
        this.onload?.();
      }, 0);
    }
  }

  globalThis.Image = MockImage as unknown as typeof Image;

  return () => {
    globalThis.Image = originalImage;
  };
}

function mockImageError() {
  const originalImage = globalThis.Image;

  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    set src(_value: string) {
      setTimeout(() => {
        this.onerror?.();
      }, 0);
    }
  }

  globalThis.Image = MockImage as unknown as typeof Image;

  return () => {
    globalThis.Image = originalImage;
  };
}

function mockFileReaderSuccess(result: string) {
  const originalFileReader = globalThis.FileReader;

  class MockFileReader {
    result: string | ArrayBuffer | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    readAsDataURL(_file: File) {
      this.result = result;

      setTimeout(() => {
        this.onload?.();
      }, 0);
    }
  }

  globalThis.FileReader = MockFileReader as unknown as typeof FileReader;

  return () => {
    globalThis.FileReader = originalFileReader;
  };
}

function mockFileReaderError() {
  const originalFileReader = globalThis.FileReader;

  class MockFileReader {
    result: string | ArrayBuffer | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    readAsDataURL(_file: File) {
      setTimeout(() => {
        this.onerror?.();
      }, 0);
    }
  }

  globalThis.FileReader = MockFileReader as unknown as typeof FileReader;

  return () => {
    globalThis.FileReader = originalFileReader;
  };
}

function mockCanvas(dataUrl: string = 'data:image/jpeg;base64,processed') {
  const originalCreateElement = document.createElement.bind(document);

  const drawImage = vi.fn();
  const toDataURL = vi.fn().mockReturnValue(dataUrl);

  vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
    if (tagName === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: vi.fn().mockReturnValue({
          drawImage,
        }),
        toDataURL,
      } as unknown as HTMLCanvasElement;
    }

    return originalCreateElement(tagName);
  }) as typeof document.createElement);

  return {
    drawImage,
    toDataURL,
  };
}

describe('imageProcessing', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('shouldNormalize', () => {
    it('returns false for small file and small dimensions', () => {
      const file = createFile(NORMALIZATION_MAX_FILE_SIZE_BYTES);

      const result = shouldNormalize(file, {
        width: NORMALIZATION_MAX_DIMENSION,
        height: NORMALIZATION_MAX_DIMENSION,
      });

      expect(result).toBe(false);
    });

    it('returns true for large file size', () => {
      const file = createFile(NORMALIZATION_MAX_FILE_SIZE_BYTES + 1);

      const result = shouldNormalize(file, {
        width: 500,
        height: 500,
      });

      expect(result).toBe(true);
    });

    it('returns true for large width', () => {
      const file = createFile(1024);

      const result = shouldNormalize(file, {
        width: NORMALIZATION_MAX_DIMENSION + 1,
        height: 500,
      });

      expect(result).toBe(true);
    });

    it('returns true for large height', () => {
      const file = createFile(1024);

      const result = shouldNormalize(file, {
        width: 500,
        height: NORMALIZATION_MAX_DIMENSION + 1,
      });

      expect(result).toBe(true);
    });
  });

  describe('calculateTargetDimensions', () => {
    it('returns original dimensions when already within maxDimension', () => {
      const result = calculateTargetDimensions(
        { width: 800, height: 600 },
        1024,
      );

      expect(result).toEqual({ width: 800, height: 600 });
    });

    it('resizes landscape image proportionally', () => {
      const result = calculateTargetDimensions(
        { width: 4000, height: 3000 },
        1024,
      );

      expect(result).toEqual({ width: 1024, height: 768 });
    });

    it('resizes portrait image proportionally', () => {
      const result = calculateTargetDimensions(
        { width: 3000, height: 4000 },
        1024,
      );

      expect(result).toEqual({ width: 768, height: 1024 });
    });
  });

  describe('readImageDimensions', () => {
    it('reads image dimensions', async () => {
      const restore = mockImageLoad(1600, 900);
      const file = createFile(1024);

      try {
        await expect(readImageDimensions(file)).resolves.toEqual({
          width: 1600,
          height: 900,
        });
      } finally {
        restore();
      }
    });

    it('throws ImageLoadError when image fails to load', async () => {
      const restore = mockImageError();
      const file = createFile(1024);

      try {
        await expect(readImageDimensions(file)).rejects.toBeInstanceOf(
          ImageLoadError,
        );
      } finally {
        restore();
      }
    });
  });

  describe('transformImage', () => {
    it('transforms image to jpeg with resized dimensions', async () => {
      const restoreImage = mockImageLoad(4000, 3000);
      const { drawImage, toDataURL } = mockCanvas();
      const file = createFile(2 * 1024 * 1024);

      try {
        const result = await transformImage(file, {
          maxDimension: 1024,
          quality: 0.75,
        });

        expect(result).toEqual({
          dataUrl: 'data:image/jpeg;base64,processed',
          width: 1024,
          height: 768,
          wasTransformed: true,
        });

        expect(drawImage).toHaveBeenCalled();
        expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.75);
      } finally {
        restoreImage();
      }
    });

    it('throws ImageLoadError when image cannot be loaded', async () => {
      const restoreImage = mockImageError();
      const file = createFile(1024);

      try {
        await expect(
          transformImage(file, {
            maxDimension: 1024,
            quality: 0.75,
          }),
        ).rejects.toBeInstanceOf(ImageLoadError);
      } finally {
        restoreImage();
      }
    });

    it('throws ImageLoadError when canvas context is unavailable', async () => {
      const restoreImage = mockImageLoad(2000, 1000);

      vi.spyOn(document, 'createElement').mockImplementation(((
        tagName: string,
      ) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue(null),
          } as unknown as HTMLCanvasElement;
        }

        return document.createElement(tagName);
      }) as typeof document.createElement);

      const file = createFile(1024);

      try {
        await expect(
          transformImage(file, {
            maxDimension: 1024,
            quality: 0.75,
          }),
        ).rejects.toBeInstanceOf(ImageLoadError);
      } finally {
        restoreImage();
      }
    });
  });

  describe('processImage', () => {
    it('returns original dataUrl when normalization is not needed', async () => {
      const restoreImage = mockImageLoad(800, 600);
      const restoreReader = mockFileReaderSuccess(
        'data:image/jpeg;base64,original',
      );
      const file = createFile(512 * 1024);

      try {
        await expect(processImage(file)).resolves.toEqual({
          dataUrl: 'data:image/jpeg;base64,original',
          width: 800,
          height: 600,
          wasTransformed: false,
        });
      } finally {
        restoreImage();
        restoreReader();
      }
    });

    it('transforms image when normalization is needed', async () => {
      const restoreImage = mockImageLoad(4000, 3000);
      mockCanvas();
      const file = createFile(2 * 1024 * 1024);

      try {
        const result = await processImage(file);

        expect(result).toEqual({
          dataUrl: 'data:image/jpeg;base64,processed',
          width: 1024,
          height: 768,
          wasTransformed: true,
        });
      } finally {
        restoreImage();
      }
    });

    it('throws ImageLoadError when original file cannot be read as dataUrl', async () => {
      const restoreImage = mockImageLoad(800, 600);
      const restoreReader = mockFileReaderError();
      const file = createFile(512 * 1024);

      try {
        await expect(processImage(file)).rejects.toBeInstanceOf(ImageLoadError);
      } finally {
        restoreImage();
        restoreReader();
      }
    });
  });
});
