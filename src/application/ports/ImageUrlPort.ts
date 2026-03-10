export type ImageUrl = string;

export interface ImageUrlPort {
  getDefaultImageUrl(): ImageUrl;
  createObjectUrl(file: File): ImageUrl;
  revokeObjectUrl(url: ImageUrl): void;
}
