'use client';

import {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import {toAbsoluteUrl} from '@/lib/http/url';

const LARAVEL_ORIGIN =
   process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
   'https://admin.petroleumstationbd.com';

type JournalDetails = {
   title: string;
   description: string;
   type: string;
   publishDate: string;
   fileUrl: string;
};

type Props = {
   open: boolean;
   journalId: string | null;
   title?: string;
   publishedDate?: string;
   description?: string;
   type?: string;
   fileUrl?: string;
   onClose: () => void;
};

function pickDate(v?: string | null) {
   if (!v) return '';
   const s = String(v);
   const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
   return match ? match[1] : s;
}

function resolveFileUrl(raw: any) {
   const direct =
      raw?.file ??
      raw?.file_url ??
      raw?.file_path ??
      raw?.document ??
      raw?.document_url ??
      null;
   if (direct) return toAbsoluteUrl(LARAVEL_ORIGIN, String(direct));
   return '';
}

function normalizeJournal(raw: any): JournalDetails {
   const j = raw?.data ?? raw;
   return {
      title: j?.title ?? 'Journal Details',
      description: j?.description ?? '',
      type: j?.type ?? 'document',
      publishDate: pickDate(j?.publish_date ?? j?.created_at ?? ''),
      fileUrl: resolveFileUrl(j),
   };
}

function renderPreview(item: JournalDetails) {
   if (!item.fileUrl) {
      return (
         <p className='text-[12px] text-[#6F8093]'>File is not available.</p>
      );
   }

   if (item.type === 'image') {
      return (
         <img
            src={item.fileUrl}
            alt={item.title}
            className='max-h-[360px] w-full rounded-[10px] object-contain'
         />
      );
   }

   if (item.type === 'video') {
      return (
         <video
            controls
            className='max-h-[360px] w-full rounded-[10px] bg-black'>
            <source src={item.fileUrl} />
         </video>
      );
   }

   return (
      <a
         href={item.fileUrl}
         target='_blank'
         rel='noreferrer noopener'
         className='inline-flex h-9 items-center justify-center rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white'>
         Open Document
      </a>
   );
}

export default function PublicJournalModal({
   open,
   journalId,
   title,
   publishedDate,
   description,
   type,
   fileUrl,
   onClose,
}: Props) {
   const [journal, setJournal] = useState<JournalDetails | null>(null);
   const [loading, setLoading] = useState(false);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const fallback = useMemo<JournalDetails>(
      () => ({
         title: title ?? 'Journal Details',
         description: description ?? '',
         type: type ?? 'document',
         publishDate: publishedDate ?? '',
         fileUrl: fileUrl ?? '',
      }),
      [description, fileUrl, publishedDate, title, type],
   );

   useEffect(() => {
      if (!open) return;

      if (!journalId) {
         setJournal(fallback);
         setLoading(false);
         setErrorMsg(null);
         return;
      }

      const id = journalId;

      const controller = new AbortController();

      async function load() {
         try {
            setLoading(true);
            setErrorMsg(null);

            const res = await fetch(
               `/api/public/journals/${encodeURIComponent(id)}`,
               {
                  cache: 'no-store',
                  signal: controller.signal,
               },
            );

            if (!res.ok) throw new Error('Failed to load journal');
            const data = await res.json().catch(() => null);
            setJournal(normalizeJournal(data));
         } catch (error: any) {
            if (error?.name === 'AbortError') return;
            console.error('Failed to load journal', error);
            setErrorMsg('Unable to load journal details right now.');
            setJournal(fallback);
         } finally {
            setLoading(false);
         }
      }

      load();
      return () => controller.abort();
   }, [fallback, journalId, open]);

   const details = journal ?? fallback;

   return (
      <Modal
         open={open}
         title={details.title}
         onClose={onClose}
         maxWidthClassName='max-w-[920px]'>
         <div className='space-y-4 p-5 text-[13px] text-[#2B3A4A]'>
            {loading ? (
               <p className='text-[12px] text-[#6F8093]'>
                  Loading journal details...
               </p>
            ) : null}

            {errorMsg ? (
               <p className='text-[12px] font-medium text-[#FC7160]'>
                  {errorMsg}
               </p>
            ) : null}

            <div className='space-y-3'>
               <div className='flex flex-wrap items-center gap-3 text-[12px] text-[#6F8093]'>
                  {details.publishDate ? (
                     <span>Published Date: {details.publishDate}</span>
                  ) : null}
                  <span className='rounded-full bg-[#E6EEF9] px-3 py-1 text-[10px] font-semibold uppercase text-[#12306B]'>
                     {details.type}
                  </span>
               </div>

               {details.description ? (
                  <p className='text-[13px] text-[#2B3A4A]'>
                     {details.description}
                  </p>
               ) : (
                  <p className='text-[13px] text-[#2B3A4A]'>
                     Journal details are not available yet.
                  </p>
               )}

               <div>{renderPreview(details)}</div>
            </div>
         </div>
      </Modal>
   );
}

