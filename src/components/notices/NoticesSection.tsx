'use client';

import {useEffect, useMemo, useState} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import MeshCorners from '@/components/ui/MeshCorners';

import {toAbsoluteUrl} from '@/lib/http/url';
import PublicNoticeModal from './PublicNoticeModal';

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

type NoticeRow = {
  id?: string;
  sl: number;
  title: string;
  publishedDate: string;
  viewUrl?: string;
  downloadUrl?: string;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function ViewButton({onClick}: {onClick: () => void}) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex h-6 items-center justify-center rounded-[4px] px-4',
        'bg-[#133374] text-[10px] font-semibold text-white shadow-sm',
        'transition hover:brightness-110 active:brightness-95'
      )}
      onClick={onClick}
    >
      View
    </button>
  );
}

function DownloadButton({href}: {href?: string}) {
  return (
    <a
      href={href ?? '#'}
      className={cx(
        'inline-flex h-6 items-center justify-center rounded-[4px] px-4',
        'bg-[#009970] text-[10px] font-semibold text-white shadow-sm',
        'transition hover:brightness-110 active:brightness-95'
      )}
      target={href ? '_blank' : undefined}
      rel={href ? 'noreferrer noopener' : undefined}
      download={href ? '' : undefined}
      onClick={(event) => {
        if (!href || href === '#') event.preventDefault();
      }}
    >
      Download
    </a>
  );
}

function normalizeList(raw: any) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

function normalizeAttachments(raw: any) {
  if (!raw) return [] as Array<{url: string}>;

  if (Array.isArray(raw) && raw.length && typeof raw[0] === 'object') {
    return raw
      .map((item: any) => {
        const fileUrl =
          item?.file_url ?? item?.url ?? item?.path ?? item?.file ?? '';
        if (!fileUrl) return null;
        return {url: toAbsoluteUrl(LARAVEL_ORIGIN, String(fileUrl))};
      })
      .filter(Boolean) as Array<{url: string}>;
  }

  if (Array.isArray(raw) && raw.every((x) => typeof x === 'string')) {
    return raw.map((fileUrl: string) => ({
      url: toAbsoluteUrl(LARAVEL_ORIGIN, fileUrl),
    }));
  }

  if (Array.isArray(raw?.data)) return normalizeAttachments(raw.data);

  return [];
}

function extractDownloadUrl(n: any) {
  const direct =
    n?.download_url ??
    n?.downloadUrl ??
    n?.file_url ??
    n?.fileUrl ??
    n?.attachment_url ??
    n?.attachmentUrl;

  if (direct) return toAbsoluteUrl(LARAVEL_ORIGIN, String(direct));

  const attachments = normalizeAttachments(n?.attachments);
  return attachments[0]?.url ?? '';
}

function pickDate(v?: string | null) {
  if (!v) return '';
  const s = String(v);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : s;
}

function parseDate(value: string) {
  if (!value) return null;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return null;
  return ts;
}

export default function NoticesSection() {
  const [rows, setRows] = useState<NoticeRow[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<NoticeRow | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('/api/public/notices', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to load notices');
        const data = await res.json().catch(() => null);
        const list = normalizeList(data);

        const mapped = list.map((n: any, idx: number) => ({
          id: n?.id ? String(n.id) : undefined,
          sl: idx + 1,
          title: n?.title ?? '',
          publishedDate: pickDate(n?.publish_date ?? n?.created_at ?? ''),
          viewUrl: n?.id ? `/notices/${n.id}` : undefined,
          downloadUrl: extractDownloadUrl(n),
        }));

        setRows(mapped);
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        console.error('Failed to load notices', error);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const newestKey = useMemo(() => {
    let latest: {key: string; ts: number} | null = null;
    rows.forEach((row) => {
      const ts = parseDate(row.publishedDate);
      if (!ts) return;
      const key = row.id ?? String(row.sl);
      if (!latest || ts > latest.ts) latest = {key, ts};
    });

    if (!latest) return null;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return latest.ts >= weekAgo ? latest.key : null;
  }, [rows]);

  const columns = useMemo<ColumnDef<NoticeRow>[]>(() => [
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
      minWidth: 420,
      cell: (r) => {
        const key = r.id ?? String(r.sl);
        const isNew = newestKey === key;
        return (
          <div className="flex items-center gap-2 text-inherit">
            <span>{r.title}</span>
            {isNew ? (
              <span className="rounded-full bg-[#F97316] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            ) : null}
          </div>
        );
      },
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
          <DownloadButton href={r.downloadUrl} />
        </div>
      ),
    },
  ], [newestKey]);

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <MeshCorners className="z-0" color="#2D8A2D" opacity={0.18} width={760} height={480} strokeWidth={1} />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <TablePanel
          rows={rows}
          columns={columns}
          getRowKey={(r) => r.id ?? String(r.sl)}
          initialSort={{id: 'publishedDate', dir: 'desc'}}
          // screenshot has no export button
          exportFileName=""
          searchText={(r) => [r.title, r.publishedDate].join(' ')}
          totalLabel={(total) => (
            <div className="text-[14px] font-semibold text-[#2D8A2D]">
              Total Notices : <span className="text-[#133374]">{total}</span>
            </div>
          )}
        />
      </div>

      <PublicNoticeModal
        open={viewOpen}
        noticeId={activeRow?.id ?? null}
        title={activeRow?.title}
        publishedDate={activeRow?.publishedDate}
        onClose={() => setViewOpen(false)}
      />
    </section>
  );
}
