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
    // Input validation
    MAX_UPLOAD_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_DIMENSION: 8000, // px

    // Image loading
    IMAGE_LOAD_TIMEOUT_MS: 3000,

    // Image normalization
    NORMALIZATION_MAX_DIMENSION: 1024, // px
    NORMALIZATION_MAX_FILE_SIZE_BYTES: 1024 * 1024, // 1MB
    NORMALIZATION_JPEG_QUALITY: 0.75,

    // Future: Iteration 2 - storage fit
    MAX_STORAGE_IMAGE_SIZE_BYTES: 2 * 1024 * 1024, // 2MB (base64 target)
  },
};
