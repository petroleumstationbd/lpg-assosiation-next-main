'use client';

import {useMemo, useState} from 'react';
import {Plus} from 'lucide-react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import Loader from '@/components/shared/Loader';
import DownloadDocumentFormModal from './DownloadDocumentFormModal';
import type {DownloadDocumentRow} from './types';
import {
   useCreateDownloadDocument,
   useDeleteDownloadDocument,
   useDownloadDocuments,
   useUpdateDownloadDocument,
} from './queries';

export default function DownloadsOverviewSection() {
   const documentsQ = useDownloadDocuments();
   const delM = useDeleteDownloadDocument();
   const createM = useCreateDownloadDocument();
   const updateM = useUpdateDownloadDocument();

   const [open, setOpen] = useState(false);
   const [mode, setMode] = useState<'create' | 'edit'>('create');
   const [activeRow, setActiveRow] = useState<DownloadDocumentRow | null>(null);
   const [formError, setFormError] = useState('');

   const columns = useMemo<ColumnDef<DownloadDocumentRow>[]>(() => {
      return [
         // {
         //   id: 'sl',
         //   header: 'SL#',
         //   sortable: true,
         //   sortValue: (r) => r.sl,
         //   headerClassName: 'w-[80px]',
         //   minWidth: 80,
         //   cell: (r) => String(r.sl).padStart(2, '0'),
         // },
         {
            id: 'title',
            header: 'Title',
            sortable: true,
            sortValue: r => r.title,
            minWidth: 280,
            cell: r => <span className='text-[#2B3A4A]'>{r.title}</span>,
         },
         {
            id: 'publishDate',
            header: 'Publish Date',
            sortable: true,
            sortValue: r => r.publishDate,
            minWidth: 140,
            cell: r => <span className='text-[#2B3A4A]'>{r.publishDate}</span>,
         },
         {
            id: 'status',
            header: 'Status',
            sortable: true,
            sortValue: r => r.status,
            align: 'center',
            minWidth: 120,
            cell: r => (
               <span
                  className={
                     r.status === 'active'
                        ? 'font-semibold text-[#2D8A2D]'
                        : 'font-semibold text-[#FC7160]'
                  }>
                  {r.status.toUpperCase()}
               </span>
            ),
         },
         {
            id: 'file',
            header: 'File',
            sortable: false,
            align: 'center',
            minWidth: 120,
            cell: r => {
               return r.fileUrl ? (
                  <a
                     href={r.fileUrl}
                     download=''
                     className='text-[12px] font-semibold text-[#133374] hover:underline'>
                     Download
                  </a>
               ) : (
                  <span className='text-[11px] text-[#94A3B8]'>No file</span>
               );
            },
         },
         {
            id: 'edit',
            header: 'Edit',
            align: 'center',
            sortable: false,
            minWidth: 120,
            cell: r => (
               <button
                  type='button'
                  onClick={() => {
                     setFormError('');
                     setMode('edit');
                     setActiveRow(r);
                     setOpen(true);
                  }}
                  className='h-7 rounded-[4px] bg-[#FFC75A] px-4 text-[11px] font-semibold text-[#2B3A4A] shadow-sm hover:brightness-105 active:brightness-95'>
                  Edit
               </button>
            ),
         },
         {
            id: 'delete',
            header: 'Delete',
            align: 'center',
            sortable: false,
            minWidth: 120,
            cell: r => (
               <button
                  type='button'
                  onClick={() => delM.mutate(r.id)}
                  disabled={delM.isPending}
                  className='h-7 rounded-[4px] bg-[#FC7160] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-105 active:brightness-95 disabled:opacity-60'>
                  Delete
               </button>
            ),
         },
      ];
   }, [delM.isPending]);

   if (documentsQ.isLoading) return <Loader label='Loading...' />;
   if (documentsQ.isError)
      return (
         <div className='text-sm text-red-600'>Failed to load documents.</div>
      );

   const rows = documentsQ.data ?? [];

   return (
      <div className='mx-auto max-w-[1040px] space-y-4'>
         <TablePanel
            rows={rows}
            columns={columns}
            getRowKey={r => r.id}
            searchText={r => `${r.sl} ${r.title} ${r.publishDate} ${r.status}`}
            showTopBar={false}
            showExport={false}
            totalLabel={total => (
               <div className='text-[14px] font-semibold text-[#2D8A2D]'>
                  Total Documents :{' '}
                  <span className='text-[#133374]'>{total}</span>
               </div>
            )}
            controlsRightSlot={
               <button
                  type='button'
                  onClick={() => {
                     setFormError('');
                     setMode('create');
                     setActiveRow(null);
                     setOpen(true);
                  }}
                  className='inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'>
                  <Plus size={16} />
                  Add Document
               </button>
            }
            className='bg-white/80'
         />

         <DownloadDocumentFormModal
            open={open}
            mode={mode}
            initial={activeRow}
            saving={createM.isPending || updateM.isPending}
            error={formError}
            onClose={() => {
               setOpen(false);
               setActiveRow(null);
               setFormError('');
            }}
            onSubmit={async payload => {
               setFormError('');

               if (!payload.title.trim()) {
                  setFormError('Title is required');
                  return;
               }

               if (!payload.publishDate) {
                  setFormError('Publish date is required');
                  return;
               }

               if (mode === 'create' && !payload.file) {
                  setFormError('Document file is required');
                  return;
               }

               try {
                  if (mode === 'create') {
                     await createM.mutateAsync(payload);
                  } else {
                     if (!activeRow?.id) {
                        setFormError('Invalid document id');
                        return;
                     }
                     await updateM.mutateAsync({
                        id: activeRow.id,
                        patch: payload,
                     });
                  }
                  setOpen(false);
                  setActiveRow(null);
               } catch (error: any) {
                  setFormError(error?.message ?? 'Unable to save document');
               }
            }}
         />
      </div>
   );
}
