// src/features/stations/verified/VerifiedStationsTable.tsx
'use client';

import { useMemo } from 'react';
import { Database, FileSpreadsheet, Eye, Pencil, FileText } from 'lucide-react';

import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import { exportRowsToCsv } from '@/components/ui/table-panel/exportCsv';

import type { VerifiedStationRow } from './types';
import { useVerifiedStations } from './queries';

const BRAND = '#009970';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function IconDot({
  title,
  onClick,
  bg,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  bg: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'grid h-5 w-5 place-items-center rounded-full shadow-sm',
        'disabled:opacity-60',
        bg
      )}
    >
      {children}
    </button>
  );
}

export default function VerifiedStationsTable() {
  const q = useVerifiedStations();

  const columns = useMemo<ColumnDef<VerifiedStationRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        align: 'center',
        headerClassName: 'w-[90px]',
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        cell: (r) => <span className="text-[#133374]">{String(r.sl).padStart(2, '0')}</span>,
      },
      {
        id: 'stationName',
        header: 'Station Name',
        sortable: true,
        sortValue: (r) => r.stationName,
        headerClassName: 'w-[240px]',
        csvHeader: 'Station Name',
        csvValue: (r) => r.stationName,
        cell: (r) => <span className="text-[#133374]">{r.stationName}</span>,
      },
      {
        id: 'ownerName',
        header: 'Owner Name',
        sortable: true,
        sortValue: (r) => r.ownerNameLines.join(' '),
        headerClassName: 'w-[200px]',
        csvHeader: 'Owner Name',
        csvValue: (r) => r.ownerNameLines.join(' | '),
        cell: (r) => (
          <div className="space-y-1 text-[#133374]">
            {r.ownerNameLines.map((line, i) => (
              <div key={i} className="leading-[1.15]">
                {line}
              </div>
            ))}
          </div>
        ),
      },
      {
        id: 'ownerPhone',
        header: 'Owner Phone',
        sortable: true,
        sortValue: (r) => r.ownerPhone,
        headerClassName: 'w-[210px]',
        csvHeader: 'Owner Phone',
        csvValue: (r) => r.ownerPhone,
        cell: (r) => <span className="text-[#133374]">{r.ownerPhone}</span>,
      },
      {
        id: 'division',
        header: 'Division',
        sortable: true,
        sortValue: (r) => r.division,
        headerClassName: 'w-[180px]',
        align: 'center',
        csvHeader: 'Division',
        csvValue: (r) => r.division,
        cell: (r) => <span className="text-[#133374]">{r.division}</span>,
      },
      {
        id: 'district',
        header: 'District',
        sortable: true,
        sortValue: (r) => r.district,
        headerClassName: 'w-[190px]',
        align: 'center',
        csvHeader: 'District',
        csvValue: (r) => r.district,
        cell: (r) => <span className="text-[#133374]">{r.district}</span>,
      },
      {
        id: 'upazila',
        header: 'Upazila',
        sortable: true,
        sortValue: (r) => r.upazila,
        headerClassName: 'w-[200px]',
        align: 'center',
        csvHeader: 'Upazila',
        csvValue: (r) => r.upazila,
        cell: (r) => <span className="text-[#133374]">{r.upazila}</span>,
      },
      {
        id: 'doc',
        header: 'Doc',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[95px]',
        csvHeader: 'Doc',
        csvValue: (r) => (r.docUrl ? 'Yes' : 'No'),
        cell: (r) => (
          <button
            type="button"
            title="Open document"
            aria-label="Open document"
            onClick={() => {
              if (!r.docUrl) return;
              window.open(r.docUrl, '_blank', 'noopener,noreferrer');
            }}
            className={cx('inline-flex items-center justify-center', !r.docUrl && 'opacity-40')}
          >
            <FileText size={18} color="#5B7FFF" />
          </button>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[130px]',
        csvHeader: 'Action',
        csvValue: () => '',
        cell: (r) => (
          <div className="flex items-center justify-center gap-2">
            <IconDot
              title="View station"
              onClick={() => {
                // Hook later: open view modal / route
                console.log('view', r.id);
              }}
              bg="bg-[#6D6DFF]"
            >
              <Eye size={12} className="text-white" />
            </IconDot>

            <IconDot
              title="Edit station"
              onClick={() => {
                // Hook later: open edit modal / route
                console.log('edit', r.id);
              }}
              bg="bg-[#F59E0B]"
            >
              <Pencil size={12} className="text-white" />
            </IconDot>
          </div>
        ),
      },
    ];
  }, []);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load stations.</div>;

  const rows = q.data ?? [];

  return (
    <TablePanel<VerifiedStationRow>
      rows={rows}
      columns={columns}
      getRowKey={(r) => r.id}
      searchText={(r) =>
        `${r.stationName} ${r.ownerNameLines.join(' ')} ${r.ownerPhone} ${r.division} ${r.district} ${r.upazila}`
      }
      exportFileName="verified-stations.csv"
      exportLabel="Export to Excel"
      showTopBar
      showExport
      totalLabel={() => (
        <button
          type="button"
          onClick={() => exportRowsToCsv(rows, columns, 'verified-stations-all.csv')}
          className="inline-flex h-[46px] w-[270px] items-center justify-center gap-3 rounded-[10px] bg-[#009970] px-6 text-[18px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95"
        >
          <Database size={20} className="text-white" />
          Export All Data
        </button>
      )}
      className="bg-transparent p-0 shadow-none backdrop-blur-0"
      topBarClassName="mt-2 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      exportButtonClassName="h-[46px] w-[270px] rounded-[10px] px-6 text-[18px] font-medium gap-3"
      controlsTextClassName="text-[20px] font-normal text-[#0A2F59]"
      selectClassName="h-[44px] w-[84px] rounded-[10px] border border-black/15 px-4 text-[18px] text-[#9AA6B2]"
      searchInputClassName="h-[44px] rounded-[10px] border border-black/15 px-4 text-[18px] text-[#2B3A4A] md:w-[220px]"
      tableWrapClassName="mt-8 overflow-hidden rounded-[12px] border border-black/10 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.12)]"
      cellWrapClassName="min-h-[92px] py-6 flex items-center"
    />
  );
}
