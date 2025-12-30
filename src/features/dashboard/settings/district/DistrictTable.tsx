'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import type { DistrictRow } from './types';
import {
  useCreateDistrict,
  useDeleteDistrict,
  useDistricts,
  useUpdateDistrict,
} from './queries';
import DistrictFormModal from './DistrictFormModal';

export default function DistrictTable() {
  const q = useDistricts();
  const del = useDeleteDistrict();
  const createM = useCreateDistrict();
  const updateM = useUpdateDistrict();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [activeRow, setActiveRow] = useState<DistrictRow | null>(null);
  const [formError, setFormError] = useState('');

  const columns = useMemo<ColumnDef<DistrictRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: '#',
        sortable: true,
        sortValue: (r) => r.sl,
        align: 'center',
        headerClassName: 'w-[80px]',
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        cell: (r) => String(r.sl),
      },
      {
        id: 'divisionName',
        header: 'Division Name',
        sortable: true,
        sortValue: (r) => r.divisionName,
        csvHeader: 'Division Name',
        csvValue: (r) => r.divisionName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.divisionName}</span>,
      },
      {
        id: 'districtName',
        header: 'District Name',
        sortable: true,
        sortValue: (r) => r.districtName,
        csvHeader: 'District Name',
        csvValue: (r) => r.districtName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.districtName}</span>,
      },
      {
        id: 'edit',
        header: 'Edit',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[130px]',
        csvHeader: 'Edit',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setMode('edit');
              setActiveRow(r);
              setModalOpen(true);
            }}
            className="h-7 rounded-[4px] bg-[#133374] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
          >
            Edit
          </button>
        ),
      },
      {
        id: 'delete',
        header: 'Delete',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Delete',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            disabled={del.isPending}
            onClick={() => del.mutate(r.id)}
            className="h-7 rounded-[4px] bg-[#FF5B5B] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-70"
          >
            Delete
          </button>
        ),
      },
    ];
  }, [del.isPending]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load districts.</div>;

  return (
    <div className="space-y-4">
      {/* Header row (keep design same) */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#2B3A4A]">Overview of Districts</h2>

        <button
          type="button"
          onClick={() => {
            setFormError('');
            setMode('create');
            setActiveRow(null);
            setModalOpen(true);
          }}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95"
        >
          <Plus size={16} />
          Add Districts
        </button>
      </div>

      <TablePanel<DistrictRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.divisionName} ${r.districtName}`}
        exportFileName="districts.csv"
        exportLabel="Export to Excel"
        showTopBar={false}
      />

      <DistrictFormModal
        open={modalOpen}
        mode={mode}
        initial={activeRow}
        onClose={() => {
          setModalOpen(false);
          setActiveRow(null);
          setFormError('');
        }}
        saving={createM.isPending || updateM.isPending}
        error={formError}
        onSubmit={async (payload) => {
          setFormError('');

          try {
            if (mode === 'create') {
              await createM.mutateAsync(payload);
            } else {
              if (!activeRow?.id) {
                setFormError('Invalid district id');
                return;
              }
              await updateM.mutateAsync({ id: activeRow.id, patch: payload });
            }

            setModalOpen(false);
            setActiveRow(null);
          } catch (e: any) {
            setFormError(e?.message ?? 'Failed to save district');
          }
        }}
      />
    </div>
  );
}
