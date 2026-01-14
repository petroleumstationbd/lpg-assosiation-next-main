'use client';

import {useEffect, useMemo, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/shared/Loader';
import SectionHeading from '@/components/ui/SectionHeading';
import newsHero from '@assets/newsfeed-img/banner.png';
import {normalizeList} from '@/lib/http/normalize';
import {toAbsoluteUrl} from '@/lib/http/url';

type AlbumImageApiRow = {
   id: number | string;
   image_url?: string | null;
   url?: string | null;
   file_url?: string | null;
   image?: string | null;
   image_path?: string | null;
};

type AlbumApiResponse = {
   id?: number | string | null;
   title?: string | null;
   description?: string | null;
   event_date?: string | null;
   images?: AlbumImageApiRow[] | null;
};

type AlbumImageRow = {
   id: number;
   url: string;
};

const FALLBACK_DESCRIPTION =
   "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.";

function normalizeAlbum(raw: any): AlbumApiResponse | null {
   if (!raw) return null;
   if (raw?.data && !Array.isArray(raw.data)) return raw.data as AlbumApiResponse;
   if (raw?.data?.data && !Array.isArray(raw.data.data))
      return raw.data.data as AlbumApiResponse;
   return raw as AlbumApiResponse;
}

function mapImageRow(row: AlbumImageApiRow): AlbumImageRow | null {
   const idNum = Number(row.id);
   if (!Number.isFinite(idNum)) return null;

   const rel = (
      row.image_url ??
      row.file_url ??
      row.url ??
      row.image ??
      row.image_path ??
      ''
   )
      .toString()
      .trim();

   if (!rel) return null;

   const origin =
      process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

   return {
      id: idNum,
      url: toAbsoluteUrl(origin, rel),
   };
}

export default function AlbumDetail({albumId}: {albumId: string}) {
   const [album, setAlbum] = useState<AlbumApiResponse | null>(null);
   const [images, setImages] = useState<AlbumImageRow[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   useEffect(() => {
      const controller = new AbortController();

      const load = async () => {
         setLoading(true);
         setError('');
         try {
            const res = await fetch(`/api/albums/${encodeURIComponent(albumId)}`, {
               method: 'GET',
               cache: 'no-store',
               signal: controller.signal,
               headers: {Accept: 'application/json'},
            });

            const raw = await res.json().catch(() => null);
            if (!res.ok) {
               setError(raw?.message ?? 'Failed to load album');
               return;
            }

            const parsed = normalizeAlbum(raw);
            setAlbum(parsed);
            const rows = normalizeList<AlbumImageApiRow>(parsed?.images ?? []);
            setImages(rows.map(mapImageRow).filter(Boolean) as AlbumImageRow[]);
         } catch (err: any) {
            if (err?.name === 'AbortError') return;
            setError('Failed to load album. Please try again.');
         } finally {
            setLoading(false);
         }
      };

      void load();
      return () => controller.abort();
   }, [albumId]);

   const title = album?.title?.toString().trim() || 'Photo Gallery';
   const description =
      album?.description?.toString().trim() || FALLBACK_DESCRIPTION;

   const content = useMemo(() => {
      if (loading) {
         return (
            <div className='py-12'>
               <Loader label='Loading album photos...' size='lg' />
            </div>
         );
      }

      if (error) {
         return (
            <div className='rounded-[16px] border border-red-100 bg-red-50 px-6 py-10 text-center text-sm text-red-600'>
               {error}
            </div>
         );
      }

      if (!images.length) {
         return (
            <div className='rounded-[16px] border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500'>
               No photos found for this album yet.
            </div>
         );
      }

      return (
         <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {images.map(image => (
               <div
                  key={image.id}
                  className='group relative aspect-[4/3] overflow-hidden rounded-[16px] bg-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
               >
                  <Image
                     src={image.url}
                     alt={title}
                     fill
                     className='object-cover transition-transform duration-300 group-hover:scale-110'
                  />
               </div>
            ))}
         </div>
      );
   }, [error, images, loading, title]);

   return (
      <main className='relative'>
         <PageHero
            title='Photo Gallery'
            subtitle='Updates, events and media from Bangladesh LPG Autogas Station & Conversion Workshop Owners’ Association'
            backgroundImage={newsHero}
            height='compact'
         />

         <section className='bg-[linear-gradient(180deg,#F6FCF7_0%,#EDF8F1_100%)] pb-16 pt-10 md:pb-24 md:pt-14'>
            <div className='lpg-container space-y-6 md:space-y-8'>
               <div className='flex flex-wrap items-center justify-between gap-3'>
                  <Link
                     href='/gallery/photo-gallery'
                     className='inline-flex items-center rounded-full border border-[#D6E6DE] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E2C6D] transition hover:border-[#6CC12A]'
                  >
                     Back to albums
                  </Link>
                  {/* <div className='text-right'>
                     <SectionHeading title={title} />
                     <p className='mt-2 max-w-xl text-[13px] text-[#5A6B7B] md:text-[14px]'>
                        {description}
                     </p>
                  </div> */}
               </div>

               {content}
            </div>
         </section>

         <Footer />
      </main>
   );
}
