export const APP_CONFIG = {
  BOARD: {
    MAX_WIDTH: 600,
    GAP_PX: 2,
  },

  TILE: {
    DEFAULT_SIZE: 96,
    MIN_SIZE: 48,
    MAX_SIZE: 120,
  },

  GAME: {
    // Input (upload) limit
    MAX_UPLOAD_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB

    // Image constraints
    MAX_IMAGE_DIMENSION: 8000, // px

    // (future, Iteration 2 - storage)
    MAX_STORAGE_IMAGE_SIZE_BYTES: 2 * 1024 * 1024, // 2MB (base64 target)
  },
};
