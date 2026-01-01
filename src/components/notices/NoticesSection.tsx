'use client';

import {useEffect, useMemo, useState} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import MeshCorners from '@/components/ui/MeshCorners';

import {MOCK_NOTICES, type NoticeRow} from './mockNotices';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function ViewButton({href}: {href?: string}) {
  return (
    <a
      href={href ?? '#'}
      className={cx(
        'inline-flex h-6 items-center justify-center rounded-[4px] px-4',
        'bg-[#133374] text-[10px] font-semibold text-white shadow-sm',
        'transition hover:brightness-110 active:brightness-95'
      )}
      onClick={(e) => {
        if (!href || href === '#') e.preventDefault();
      }}>
      View
    </a>
  );
}

function normalizeList(raw: any) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

function pickDate(v?: string | null) {
  if (!v) return '';
  const s = String(v);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : s;
}

export default function NoticesSection() {
  const [rows, setRows] = useState<NoticeRow[]>(MOCK_NOTICES);

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
      cell: (r) => <span className="text-inherit">{r.title}</span>,
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
        <div className="w-full flex justify-center">
          <ViewButton href={r.viewUrl} />
        </div>
      ),
    },
  ], []);

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
          // screenshot has no export button
          exportFileName=""
          searchText={(r) => [r.title, r.publishedDate].join(' ')}
          // screenshot top-left shows just "Show 10 entries" (no Total Members label)
          totalLabel={() => null}
        />
      </div>
    </section>
  );
}
