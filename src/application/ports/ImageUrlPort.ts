export type ImageUrl = string;

export interface ImageUrlPort {
  getDefaultImageUrl(): ImageUrl;
  readAsDataUrl(file: File): Promise<ImageUrl>;
}
