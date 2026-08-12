import type { BlocksContent } from "@strapi/blocks-react-renderer";
import type { Media } from "./media";

/** Texto enriquecido de Strapi (Blocks) o texto plano. */
export type Texto = BlocksContent | string | null | undefined;

export interface CallToAction {
  label: string;
  href: string;
  nuevaPestania?: boolean;
}

/** Círculo de servicio del inicio → enlaza a /servicios/<slug>. */
export interface ServicioCirculo {
  nombre: string;
  descripcion?: string;
  href: string;
  imagen: Media | null;
}

/** Trabajo realizado (galería del inicio y de cada servicio). */
export interface Trabajo {
  titulo: string;
  categoria?: string;
  descripcion?: string;
  imagen: Media | null;
  /** Ocupa el doble de espacio en el mosaico. */
  destacado?: boolean;
}

export interface HorarioDia {
  /** Día o rango de días. Nombre del campo en Strapi: `dias`. */
  dias: string;
  /** Franja horaria. Nombre del campo en Strapi: `hora`. */
  hora: string;
  cerrado?: boolean;
  /** Resalta la fila (p. ej. la jornada principal). */
  destacado?: boolean;
}

export interface Ubicacion {
  direccion: string;
  ciudad?: string;
  referencia?: string;
  /** URL del iframe de Google Maps (campo `src` del embed). */
  mapaEmbed?: string;
  /** Enlace externo "Cómo llegar". */
  mapaHref?: string;
  /** Coordenadas para el mapa 3D de Mapbox. Si faltan se infieren del embed. */
  latitud?: number;
  longitud?: number;
}

export interface ItemCategoria {
  nombre: string;
}

/** Categoría de un servicio. El template la recibe; la página decide cómo se ve. */
export interface Categoria {
  nombre: string;
  descripcion?: string;
  imagen: Media | null;
  items?: ItemCategoria[];
}

export interface PuntoClave {
  texto: string;
}

/** Bloque final de persuasión: el objetivo es que el cliente contacte a ventas. */
export interface Cierre {
  titulo: string;
  mensaje?: Texto;
  callToAction?: CallToAction;
  telefono?: string;
  whatsapp?: string;
  whatsappMensaje?: string;
}
