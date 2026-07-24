/**
 * Image path helper
 * 
 * Returns local image paths for use with Next.js Image component.
 * Local images are stored in /public/images/ and served directly.
 * 
 * Usage:
 *   import { getPlaceholderImage } from '@/lib/placeholderImage';
 *   const imageUrl = getPlaceholderImage('/images/Desa Nyalian_1.webp');
 */

export function getPlaceholderImage(
  relativePath: string
): string {
  // Return the local path as-is for Next.js Image component
  // Next.js will handle optimization automatically
  return relativePath;
}

export function getPlaceholderAvatar(name: string): string {
  // Generate avatar using ui-avatars.com for user reviews
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2F855A&color=fff&size=128&bold=true`;
}
