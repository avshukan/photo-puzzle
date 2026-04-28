import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateImage } from './imageValidation';
import {
  ImageTooLargeError,
  ImageTypeError,
  ImageWidthTooLargeError,
  ImageHeightTooLargeError,
  ImageLoadError,
} from '../errors/ImageErrors';

// --- helpers ---

function createFile(size: number): File {
  return new File([new Uint8Array(size)], 'test.jpg', { type: 'image/jpeg' });
}

function mockImageLoad(width: number, height: number) {
  const originalImage = globalThis.Image;

  class MockImage {
    width = 0;

    height = 0;

    naturalWidth = width;

    naturalHeight = height;

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

// --- config mock ---

vi.mock('../../app/config/app', () => ({
  APP_CONFIG: {
    GAME: {
      MAX_UPLOAD_FILE_SIZE_BYTES: 10 * 1024 * 1024,
      MAX_IMAGE_DIMENSION: 8000,
      IMAGE_LOAD_TIMEOUT_MS: 3000,
    },
  },
}));

// --- tests ---

describe('validateImage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass for valid image', async () => {
    const restore = mockImageLoad(1000, 1000);

    try {
      const file = createFile(1024);

      await expect(validateImage(file)).resolves.toBeUndefined();
    } finally {
      restore();
    }
  });

  it('should throw ImageTooLargeError for large file', async () => {
    const restore = mockImageLoad(1000, 1000);

    try {
      const file = createFile(11 * 1024 * 1024);

      await expect(validateImage(file)).rejects.toBeInstanceOf(
        ImageTooLargeError,
      );
    } finally {
      restore();
    }
  });

  it('should throw ImageTypeError for non-image file', async () => {
    const file = new File(['data'], 'document.pdf', {
      type: 'application/pdf',
    });

    await expect(validateImage(file)).rejects.toBeInstanceOf(ImageTypeError);
  });

  it('should throw ImageWidthTooLargeError', async () => {
    const restore = mockImageLoad(9000, 1000);

    try {
      const file = createFile(1024);

      await expect(validateImage(file)).rejects.toBeInstanceOf(
        ImageWidthTooLargeError,
      );
    } finally {
      restore();
    }
  });

  it('should throw ImageHeightTooLargeError', async () => {
    const restore = mockImageLoad(1000, 9000);

    try {
      const file = createFile(1024);

      await expect(validateImage(file)).rejects.toBeInstanceOf(
        ImageHeightTooLargeError,
      );
    } finally {
      restore();
    }
  });

  it('should throw ImageLoadError when image fails to load', async () => {
    const restore = mockImageError();

    try {
      const file = createFile(1024);

      await expect(validateImage(file)).rejects.toBeInstanceOf(ImageLoadError);
    } finally {
      restore();
    }
  });

  it('should throw ImageLoadError when image never resolves', async () => {
    vi.useFakeTimers();

    const originalImage = globalThis.Image;

    class MockImageNeverResolves {
      onload: (() => void) | null = null;

      onerror: (() => void) | null = null;

      set src(_value: string) {}
    }

    globalThis.Image = MockImageNeverResolves as unknown as typeof Image;

    try {
      const file = createFile(1024);

      const promise = validateImage(file);

      const expectation =
        expect(promise).rejects.toBeInstanceOf(ImageLoadError);

      await vi.runAllTimersAsync();

      await expectation;
    } finally {
      globalThis.Image = originalImage;

      vi.useRealTimers();
    }
  });
});
