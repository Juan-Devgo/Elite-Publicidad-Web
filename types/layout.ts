export interface Subpage {
  nombre: string;
  href: string;
}

export interface Page {
  nombre: string;
  href: string;
  subpaginas?: Subpage[];
}
