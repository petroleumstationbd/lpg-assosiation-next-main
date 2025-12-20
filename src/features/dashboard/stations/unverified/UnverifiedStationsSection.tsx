'use client';

import {useMemo} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {Database, Eye, FileSpreadsheet, Pencil, Trash2, BadgeCheck} from 'lucide-react';
import type {StationRow} from './types.js';

const BRAND = '#009970';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function ActionDot({
  title,
  onClick,
  bg,
  children,
}: {
  title: string;
  onClick: () => void;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cx('grid h-6 w-6 place-items-center rounded-full shadow-sm', bg)}
    >
      {children}
    </button>
  );
}

// mock for now (replace with query)
const MOCK: StationRow[] = Array.from({length: 36}, (_, i) => ({
  id: `st_${i + 1}`,
  sl: i + 1,
  stationName: ['Farrell Inc', 'Dibbert Group', 'Kihn Inc', 'Windler – Dietrich'][i % 4],
  ownerName: 'Engr. Md. Serajul Mawla',
  phone: ['580.903.7093 x721', '406-946-4797 x97642', '702-291-4803 x4066'][i % 3],
  division: ['Nigeria', 'Belgium', 'United Kingdom', 'Taiwan'][i % 4],
  district: ['Lake Aubreyside', 'Vonland', 'Eastvale', 'Abbottview'][i % 4],
  upazila: ['Lake Aubreyside', 'Vonland', 'Eastvale', 'Abbottview'][i % 4],
}));

export default function UnverifiedStationsSection() {
  const rows = MOCK;

  const columns = useMemo<ColumnDef<StationRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        headerClassName: 'w-[90px]',
        align: 'center',
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
        sortValue: (r) => r.ownerName,
        headerClassName: 'w-[200px]',
        csvHeader: 'Owner Name',
        csvValue: (r) => r.ownerName,
        cell: (r) => <span className="text-[#133374]">{r.ownerName}</span>,
      },
      {
        id: 'phone',
        header: 'Phone',
        sortable: true,
        sortValue: (r) => r.phone,
        headerClassName: 'w-[180px]',
        csvHeader: 'Phone',
        csvValue: (r) => r.phone,
        cell: (r) => <span className="text-[#133374]">{r.phone}</span>,
      },
      {
        id: 'division',
        header: 'Division',
        sortable: true,
        sortValue: (r) => r.division,
        headerClassName: 'w-[170px]',
        csvHeader: 'Division',
        csvValue: (r) => r.division,
        cell: (r) => <span className="text-[#133374]">{r.division}</span>,
      },
      {
        id: 'district',
        header: 'District',
        sortable: true,
        sortValue: (r) => r.district,
        headerClassName: 'w-[170px]',
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
        csvHeader: 'Upazila',
        csvValue: (r) => r.upazila,
        cell: (r) => <span className="text-[#133374]">{r.upazila}</span>,
      },
      {
        id: 'verify',
        header: 'Verify',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[120px]',
        csvHeader: 'Verify',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => console.log('Verify station:', r.id)}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#4F6DFF] text-white shadow-sm"
            title="Verify"
            aria-label="Verify"
          >
            <BadgeCheck size={16} />
          </button>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[160px]',
        csvHeader: 'Action',
        csvValue: () => '',
        cell: (r) => (
          <div className="flex items-center justify-center gap-2">
            <ActionDot title="View" onClick={() => console.log('View:', r.id)} bg="bg-[#6D5EF7] text-white">
              <Eye size={14} />
            </ActionDot>
            <ActionDot title="Delete" onClick={() => console.log('Delete:', r.id)} bg="bg-[#EF4444] text-white">
              <Trash2 size={14} />
            </ActionDot>
            <ActionDot title="Edit" onClick={() => console.log('Edit:', r.id)} bg="bg-[#F59E0B] text-white">
              <Pencil size={14} />
            </ActionDot>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-center text-[18px] font-semibold text-[#133374]">Unverified Stations</h2>

      <TablePanel<StationRow>
        rows={rows}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) =>
          `${r.sl} ${r.stationName} ${r.ownerName} ${r.phone} ${r.division} ${r.district} ${r.upazila}`
        }
        showTopBar={false}
        showExport={false}
        exportFileName=""
        cellWrapClassName="min-h-[92px] py-6 flex items-center"
        topSlot={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => console.log('Export all data')}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#009970] px-8 text-[13px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
            >
              <Database size={18} />
              Export All Data
            </button>

            <button
              type="button"
              onClick={() => console.log('Export to excel')}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#009970] px-8 text-[13px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
            >
              <FileSpreadsheet size={18} />
              Export to Excel
            </button>
          </div>
        }
      />
    </section>
  );
}
