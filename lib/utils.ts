import type { Media } from '../types/media';
import { CMS_BASE_URL } from './content-manager';

function buildMediaUrl(path: string | null) {
  if (!path) return null;
  return `${CMS_BASE_URL}${path}`;
}

export function getMedia(mediaRaw: any, size: 'large' | 'small' | 'thumbnail' = 'large'): Media | null {
  if (!mediaRaw) return null;

  const isImage = mediaRaw?.formats?.thumbnail?.mime?.startsWith('image');
  const isVideo =
    mediaRaw?.name?.toLowerCase().match(/\.(mp4|webm|ogg)$/i) ||
    mediaRaw?.url?.toLowerCase().match(/\.(mp4|webm|ogg)$/i);

  const media: Media = {
    id: mediaRaw?.id ?? null,
    type: isImage ? 'image' : isVideo ? 'video' : 'unknown',
    url: buildMediaUrl(mediaRaw?.formats?.[size]?.url ?? mediaRaw?.url ?? null),
    alt: mediaRaw?.alternativeText ?? null,
    width: mediaRaw?.formats?.[size]?.width ?? null,
    height: mediaRaw?.formats?.[size]?.height ?? null,
  };

  return media;
}
