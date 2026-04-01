export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export class ImageTooLargeError extends ImageValidationError {
  constructor(maxSizeMb: number) {
    super(`File is too large (max ${maxSizeMb}MB)`);
    this.name = 'ImageTooLargeError';
  }
}

export class ImageWidthTooLargeError extends ImageValidationError {
  constructor(maxWidth: number) {
    super(`Image width is too large (max ${maxWidth}px)`);
    this.name = 'ImageWidthTooLargeError';
  }
}

export class ImageHeightTooLargeError extends ImageValidationError {
  constructor(maxHeight: number) {
    super(`Image height is too large (max ${maxHeight}px)`);
    this.name = 'ImageHeightTooLargeError';
  }
}
