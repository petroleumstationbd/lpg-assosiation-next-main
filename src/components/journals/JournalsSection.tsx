'use client';

import {useEffect, useMemo, useState} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import MeshCorners from '@/components/ui/MeshCorners';
import {toAbsoluteUrl} from '@/lib/http/url';
import PublicJournalModal from './PublicJournalModal';

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
  'https://admin.petroleumstationbd.com';

type JournalApiItem = {
  id?: number | string;
  public_id?: number | string;
  journal_id?: number | string;
  title?: string | null;
  type?: string | null;
  description?: string | null;
  publish_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  file?: string | null;
  file_url?: string | null;
  file_path?: string | null;
  document?: string | null;
  document_url?: string | null;
  is_active?: boolean | number | string | null;
};

type JournalRow = {
  id?: string;
  sl: number;
  title: string;
  type: string;
  publishedDate: string;
  fileUrl: string;
  description: string;
};

function normalizeList(raw: any) {
  if (Array.isArray(raw)) return raw as JournalApiItem[];
  if (Array.isArray(raw?.data)) return raw.data as JournalApiItem[];
  if (Array.isArray(raw?.data?.data)) return raw.data.data as JournalApiItem[];
  return [] as JournalApiItem[];
}

function pickDate(value?: string | null) {
  if (!value) return '';
  const s = String(value);
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : s;
}

function resolveFileUrl(item: JournalApiItem) {
  const direct =
    item.file ??
    item.file_url ??
    item.file_path ??
    item.document ??
    item.document_url ??
    null;
  if (direct) return toAbsoluteUrl(LARAVEL_ORIGIN, direct);
  return '';
}

function isActive(item: JournalApiItem) {
  if (item.is_active === false) return false;
  if (typeof item.is_active === 'string') return item.is_active !== '0';
  if (typeof item.is_active === 'number') return item.is_active !== 0;
  return true;
}

function buildDownloadHref(rawUrl?: string) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    if (parsed.origin === LARAVEL_ORIGIN) {
      return `/api/station-documents/download?url=${encodeURIComponent(
        parsed.toString()
      )}`;
    }
  } catch {
    return rawUrl;
  }
  return rawUrl;
}

function ViewButton({onClick}: {onClick: () => void}) {
  return (
    <button
      type="button"
      className="inline-flex h-6 items-center justify-center rounded-[4px] bg-[#133374] px-4 text-[10px] font-semibold text-white shadow-sm transition hover:brightness-110"
      onClick={onClick}
    >
      View
    </button>
  );
}

function DownloadButton({href}: {href?: string}) {
  const downloadHref = buildDownloadHref(href);
  return (
    <a
      href={downloadHref || '#'}
      className="inline-flex h-6 items-center justify-center rounded-[4px] bg-[#009970] px-4 text-[10px] font-semibold text-white shadow-sm transition hover:brightness-110"
      download={downloadHref ? '' : undefined}
      onClick={(event) => {
        if (!downloadHref || downloadHref === '#') event.preventDefault();
      }}
    >
      Download
    </a>
  );
}

export default function JournalsSection() {
  const [rows, setRows] = useState<JournalRow[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<JournalRow | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('/api/public/journals/list', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to load journals');
        const data = await res.json().catch(() => null);
        const list = normalizeList(data).filter(isActive);

        const mapped: JournalRow[] = list.map((item, idx) => {
          const idRaw =
            item.public_id ?? item.journal_id ?? item.id ?? String(idx + 1);

          return {
            id: idRaw ? String(idRaw) : undefined,
            sl: idx + 1,
            title: item.title ?? `Journal ${idx + 1}`,
            type: item.type ?? 'document',
            publishedDate: pickDate(
              item.publish_date ?? item.created_at ?? item.updated_at
            ),
            fileUrl: resolveFileUrl(item),
            description: item.description ?? '',
          };
        });

        setRows(mapped);
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        console.error('Failed to load journals', error);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const columns = useMemo<ColumnDef<JournalRow>[]>(
    () => [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        headerClassName: 'w-[70px]',
        minWidth: 70,
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'title',
        header: 'Title',
        sortable: true,
        sortValue: (r) => r.title,
        csvHeader: 'Title',
        csvValue: (r) => r.title,
        minWidth: 320,
        cell: (r) => <span className="text-inherit">{r.title}</span>,
      },
      {
        id: 'type',
        header: 'Type',
        sortable: true,
        sortValue: (r) => r.type,
        csvHeader: 'Type',
        csvValue: (r) => r.type,
        headerClassName: 'w-[140px]',
        minWidth: 140,
        cell: (r) => (
          <span className="rounded-full bg-[#E6EEF9] px-3 py-1 text-[10px] font-semibold uppercase text-[#12306B]">
            {r.type}
          </span>
        ),
      },
      {
        id: 'publishedDate',
        header: 'Published Date',
        sortable: true,
        sortValue: (r) => r.publishedDate,
        csvHeader: 'Published Date',
        csvValue: (r) => r.publishedDate,
        minWidth: 180,
        cell: (r) => <span className="text-inherit">{r.publishedDate}</span>,
      },
      {
        id: 'view',
        header: 'View',
        sortable: false,
        csvHeader: 'View',
        csvValue: () => '',
        minWidth: 140,
        cell: (r) => (
          <div className="flex w-full justify-center">
            <ViewButton
              onClick={() => {
                setActiveRow(r);
                setViewOpen(true);
              }}
            />
          </div>
        ),
      },
      {
        id: 'download',
        header: 'Download',
        sortable: false,
        csvHeader: 'Download',
        csvValue: () => '',
        minWidth: 160,
        cell: (r) => (
          <div className="flex w-full justify-center">
            <DownloadButton href={r.fileUrl} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <MeshCorners
        className="z-0"
        color="#2D8A2D"
        opacity={0.18}
        width={760}
        height={480}
        strokeWidth={1}
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <TablePanel
          rows={rows}
          columns={columns}
          getRowKey={(r) => r.id ?? String(r.sl)}
          exportFileName=""
          searchText={(r) => [r.title, r.type, r.publishedDate].join(' ')}
          totalLabel={(total) => (
            <div className="text-[14px] font-semibold text-[#2D8A2D]">
              Total Journals : <span className="text-[#133374]">{total}</span>
            </div>
          )}
        />
      </div>

      <PublicJournalModal
        open={viewOpen}
        journalId={activeRow?.id ?? null}
        title={activeRow?.title}
        publishedDate={activeRow?.publishedDate}
        description={activeRow?.description}
        type={activeRow?.type}
        fileUrl={activeRow?.fileUrl}
        onClose={() => setViewOpen(false)}
      />
    </section>
  );
}
