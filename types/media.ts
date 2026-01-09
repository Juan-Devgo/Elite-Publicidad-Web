export type Media = {
  id?: string;
  type: 'image' | 'video' | 'unknown';
  url: string | null;
  alt?: string;
  width?: number;
  height?: number;
};
