import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateImage } from './imageValidation';
import {
  ImageTooLargeError,
  ImageWidthTooLargeError,
  ImageHeightTooLargeError,
} from '../errors/ImageErrors';

// --- helpers ---

function createFile(size: number): File {
  return new File([new Uint8Array(size)], 'test.jpg', { type: 'image/jpeg' });
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

// --- config mock ---

vi.mock('../../app/config/app', () => ({
  APP_CONFIG: {
    GAME: {
      MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
      MAX_IMAGE_DIMENSION: 8000,
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

    const file = createFile(1024);

    await expect(validateImage(file)).resolves.toBeUndefined();

    restore();
  });

  it('should throw ImageTooLargeError for large file', async () => {
    const file = createFile(11 * 1024 * 1024);

    await expect(validateImage(file)).rejects.toBeInstanceOf(
      ImageTooLargeError,
    );
  });

  it('should throw ImageWidthTooLargeError', async () => {
    const restore = mockImageLoad(9000, 1000);

    const file = createFile(1024);

    await expect(validateImage(file)).rejects.toBeInstanceOf(
      ImageWidthTooLargeError,
    );

    restore();
  });

  it('should throw ImageHeightTooLargeError', async () => {
    const restore = mockImageLoad(1000, 9000);

    const file = createFile(1024);

    await expect(validateImage(file)).rejects.toBeInstanceOf(
      ImageHeightTooLargeError,
    );

    restore();
  });

  it('should throw on image load error', async () => {
    const restore = mockImageError();

    const file = createFile(1024);

    await expect(validateImage(file)).rejects.toThrow();

    restore();
  });
});
