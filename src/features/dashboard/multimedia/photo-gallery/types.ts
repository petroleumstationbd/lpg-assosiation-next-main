import type { StaticImageData } from 'next/image';

export type GalleryAlbum = {
  id: number;
  title: string;
  cover: string | StaticImageData | null;
  eventDate?: string | null;
};
