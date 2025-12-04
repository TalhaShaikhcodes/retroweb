// GIF CDN helper functions for Supabase Storage

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const BUCKET_NAME = 'retro-gifs';

/**
 * Get the full CDN URL for a GIF in Supabase Storage
 * @param path - Path within the bucket (e.g., 'animations/construction.gif')
 * @returns Full CDN URL
 */
export function getGifUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

/**
 * Get the storage path for uploading
 * @param category - Category folder (animations, backgrounds, buttons, decorations)
 * @param filename - GIF filename
 * @returns Storage path
 */
export function getStoragePath(category: string, filename: string): string {
  return `${category}/${filename}`;
}

/**
 * Validate GIF file
 * @param file - File to validate
 * @returns true if valid GIF
 */
export function isValidGif(file: File): boolean {
  return file.type === 'image/gif' && file.size <= 5 * 1024 * 1024; // 5MB max
}
