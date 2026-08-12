import type { Media } from '../types/media';
import type { Categoria, Trabajo } from '../types/contenido';
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

/**
 * Normaliza una entrada de la colección `servicios` de Strapi para pasarla
 * directamente a `ServicioTemplate`. Tolera datos incompletos o ausentes.
 */
export function mapServicio(raw: any) {
  const categorias: Categoria[] = (raw?.categorias ?? []).map((c: any) => ({
    nombre: c?.nombre ?? '',
    descripcion: c?.descripcion ?? '',
    imagen: getMedia(c?.imagen, 'small'),
    items: c?.items ?? [],
  }));

  const trabajos: Trabajo[] = (raw?.trabajos ?? []).map((t: any) => ({
    titulo: t?.titulo ?? '',
    categoria: t?.categoria ?? '',
    descripcion: t?.descripcion ?? '',
    imagen: getMedia(t?.image, 'large'),
    destacado: t?.destacado ?? false,
  }));

  return {
    etiqueta: raw?.etiqueta ?? undefined,
    titulo: raw?.titulo ?? undefined,
    subtitulo: raw?.subtitulo ?? undefined,
    imagen: getMedia(raw?.imagen, 'large'),
    callToAction: raw?.callToAction ?? null,

    introTitulo: raw?.introTitulo ?? undefined,
    introMensaje: raw?.introMensaje ?? undefined,
    puntosClave: raw?.puntosClave ?? [],

    categoriasEtiqueta: raw?.categoriasEtiqueta ?? undefined,
    categoriasTitulo: raw?.categoriasTitulo ?? undefined,
    categoriasSubtitulo: raw?.categoriasSubtitulo ?? undefined,
    categorias,

    trabajosEtiqueta: raw?.trabajosEtiqueta ?? undefined,
    trabajosTitulo: raw?.trabajosTitulo ?? undefined,
    trabajosSubtitulo: raw?.trabajosSubtitulo ?? undefined,
    trabajos,

    cierre: raw?.cierre ?? null,

    metaTitulo: raw?.metaTitulo ?? undefined,
    metaDescripcion: raw?.metaDescripcion ?? undefined,
  };
}
