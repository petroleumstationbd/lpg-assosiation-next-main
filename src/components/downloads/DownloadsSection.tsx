'use client';

import {useEffect, useMemo, useState} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import MeshCorners from '@/components/ui/MeshCorners';
import Modal from '@/components/ui/modal/Modal';
import {toAbsoluteUrl} from '@/lib/http/url';

import {MOCK_DOWNLOADS, type DownloadRow} from './mockDownloads';

function cx(...v: Array<string | false | null | undefined>) {
   return v.filter(Boolean).join(' ');
}

type DownloadApiItem = {
   id?: number | string;
   title?: string | null;
   document_type?: string | null;
   name?: string | null;
   publish_date?: string | null;
   published_at?: string | null;
   created_at?: string | null;
   updated_at?: string | null;
   file_url?: string | null;
   file_path?: string | null;
   url?: string | null;
   file?: string | null;
   attachments?: Array<
      | string
      | {url?: string | null; path?: string | null; file?: string | null; file_url?: string | null; name?: string | null}
   > | null;
};

const LARAVEL_ORIGIN =
   process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

function normalizeList(raw: any) {
   if (Array.isArray(raw)) return raw as DownloadApiItem[];
   if (Array.isArray(raw?.data)) return raw.data as DownloadApiItem[];
   return [];
}

function pickDate(value?: string | null) {
   if (!value) return '';
   const s = String(value);
   const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
   return match ? match[1] : s;
}

function resolveFileUrl(item: DownloadApiItem) {
   const direct =
      item.file_url ?? item.file_path ?? item.url ?? item.file ?? null;
   if (direct) return toAbsoluteUrl(LARAVEL_ORIGIN, direct);

   const attachments = item.attachments ?? [];
   if (Array.isArray(attachments) && attachments.length) {
      const first = attachments[0];
      if (typeof first === 'string') return toAbsoluteUrl(LARAVEL_ORIGIN, first);
      if (typeof first === 'object' && first) {
         const nested =
            first.file_url ?? first.url ?? first.path ?? first.file ?? null;
         if (nested) return toAbsoluteUrl(LARAVEL_ORIGIN, nested);
      }
   }

   return '';
}

function mapDownloadRow(item: DownloadApiItem, idx: number): DownloadRow {
   const title =
      item.title ??
      item.document_type ??
      item.name ??
      `Document ${idx + 1}`;
   const fileUrl = resolveFileUrl(item);

   return {
      sl: idx + 1,
      title,
      publishedDate: pickDate(
         item.publish_date ?? item.published_at ?? item.created_at ?? item.updated_at
      ),
      viewUrl: fileUrl,
      downloadUrl: fileUrl,
   };
}

function ActionButton({
   label,
   href,
   variant,
   onClick,
}: {
   label: string;
   href?: string;
   variant: 'view' | 'download';
   onClick?: () => void;
}) {
   const base =
      'inline-flex h-6 items-center justify-center rounded-[4px] px-4 text-[10px] font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95';

   const cls = variant === 'view' ? 'bg-[#133374]' : 'bg-[#009970]';

   if (variant === 'view') {
      return (
         <button
            type='button'
            className={cx(base, cls)}
            onClick={onClick}
            disabled={!href}>
            {label}
         </button>
      );
   }

   return (
      <a
         href={href ?? '#'}
         className={cx(base, cls)}
         download={variant === 'download' && href ? '' : undefined}
         onClick={e => {
            if (!href || href === '#') e.preventDefault();
         }}>
         {label}
      </a>
   );
}

export default function DownloadsSection() {
   const [rows, setRows] = useState<DownloadRow[]>(MOCK_DOWNLOADS);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);
   const [activeRow, setActiveRow] = useState<DownloadRow | null>(null);
   const [open, setOpen] = useState(false);

   useEffect(() => {
      const controller = new AbortController();

      async function loadDownloads() {
         try {
            setErrorMsg(null);
            const res = await fetch('/api/public/downloadable-documents', {
               cache: 'no-store',
               signal: controller.signal,
            });
            if (!res.ok) throw new Error('Failed to load downloads');
            const data = await res.json().catch(() => null);
            const list = normalizeList(data);
            const mapped = list.map(mapDownloadRow);
            setRows(mapped.length ? mapped : MOCK_DOWNLOADS);
         } catch (error: any) {
            if (error?.name === 'AbortError') return;
            console.error('Failed to load downloads', error);
            setErrorMsg('Unable to load downloads right now.');
            setRows(MOCK_DOWNLOADS);
         }
      }

      loadDownloads();
      return () => controller.abort();
   }, []);

   const columns = useMemo<ColumnDef<DownloadRow>[]>(
      () => [
         {
            id: 'sl',
            header: 'SL#',
            sortable: true,
            sortValue: r => r.sl,
            csvHeader: 'SL',
            csvValue: r => r.sl,
            headerClassName: 'w-[70px]',
            minWidth: 70,
            cell: r => String(r.sl).padStart(2, '0'),
         },
         {
            id: 'title',
            header: 'Title',
            sortable: true,
            sortValue: r => r.title,
            csvHeader: 'Title',
            csvValue: r => r.title,
            minWidth: 380,
            cell: r => <span className='text-inherit'>{r.title}</span>,
         },
         {
            id: 'publishedDate',
            header: 'Published Date',
            sortable: true,
            sortValue: r => r.publishedDate,
            csvHeader: 'Published Date',
            csvValue: r => r.publishedDate,
            minWidth: 160,
            cell: r => <span className='text-inherit'>{r.publishedDate}</span>,
         },
         // {
         //    id: 'view',
         //    header: 'View',
         //    sortable: false,
         //    csvHeader: 'View',
         //    csvValue: () => '',
         //    minWidth: 120,
         //    cell: r => (
         //       <div className='w-full flex justify-center'>
         //          <ActionButton
         //             label='View'
         //             href={r.viewUrl}
         //             variant='view'
         //             onClick={() => {
         //                if (!r.viewUrl) return;
         //                setActiveRow(r);
         //                setOpen(true);
         //             }}
         //          />
         //       </div>
         //    ),
         // },
         {
            id: 'download',
            header: 'Download',
            sortable: false,
            csvHeader: 'Download',
            csvValue: () => '',
            minWidth: 140,
            cell: r => (
               <div className='w-full flex justify-center'>
                  <ActionButton
                     label='Download'
                     href={r.downloadUrl}
                     variant='download'
                  />
               </div>
            ),
         },
      ],
      [setActiveRow, setOpen]
   );

   return (
      <section className='relative overflow-hidden bg-[#F4F9F4] py-14'>
         <div className='absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]' />

         <MeshCorners
            className='z-0'
            color='#2D8A2D'
            opacity={0.18}
            width={760}
            height={480}
            strokeWidth={1}
         />

         <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]' />

         <div className='lpg-container relative z-10'>
            {errorMsg ? (
               <p className='mb-4 text-[12px] font-medium text-[#FC7160]'>
                  {errorMsg}
               </p>
            ) : null}
            <TablePanel
               rows={rows}
               columns={columns}
               getRowKey={r => String(r.sl)}
               // screenshot has NO export button
               exportFileName=''
               searchText={r => [r.title, r.publishedDate].join(' ')}
               totalLabel={(total) => (
                  <div className='text-[14px] font-semibold text-[#2D8A2D]'>
                     Total Documents :{' '}
                     <span className='text-[#133374]'>{total}</span>
                  </div>
               )}
            />
         </div>

         <Modal
            open={open}
            title={activeRow?.title ?? 'Document Preview'}
            onClose={() => {
               setOpen(false);
               setActiveRow(null);
            }}
            maxWidthClassName='max-w-[960px]'>
            <div className='p-4'>
               {activeRow?.viewUrl ? (
                  (() => {
                     const url = activeRow.viewUrl ?? '';
                     const lower = url.toLowerCase();
                     if (lower.endsWith('.pdf')) {
                        return (
                           <iframe
                              title={activeRow.title}
                              src={url}
                              className='h-[70vh] w-full rounded-[6px] border border-[#E5E7EB]'
                           />
                        );
                     }
                     if (
                        lower.endsWith('.png') ||
                        lower.endsWith('.jpg') ||
                        lower.endsWith('.jpeg') ||
                        lower.endsWith('.gif')
                     ) {
                        return (
                           <img
                              src={url}
                              alt={activeRow.title}
                              className='max-h-[70vh] w-full rounded-[6px] object-contain'
                           />
                        );
                     }
                     return (
                        <div className='space-y-2 text-sm text-[#2B3A4A]'>
                           <p>Preview is unavailable. Use the link below to view the file.</p>
                           <a
                              href={url}
                              target='_blank'
                              rel='noreferrer noopener'
                              className='font-semibold text-[#133374] hover:underline'>
                              Open document
                           </a>
                        </div>
                     );
                  })()
               ) : (
                  <p className='text-sm text-[#64748B]'>No document available.</p>
               )}
            </div>
         </Modal>
      </section>
   );
}
