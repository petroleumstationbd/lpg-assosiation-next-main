'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import Modal from '@/components/ui/modal/Modal';

import type { UpazilaRow } from './types';
import { useCreateUpazila, useDeleteUpazila, useUpazilas, useUpdateUpazila } from './queries';
import { normalizeList } from '@/lib/http/normalize';

type DistrictApiRow = {
  id: number | string;
  name?: string | null;

  division_name?: string | null;
  division?: { name?: string | null } | null;
};

type DistrictOption = {
  id: number;
  districtName: string;
  divisionName: string;
  label: string;
};

function pickText(...vals: Array<unknown>) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

async function fetchDistrictOptions(): Promise<DistrictOption[]> {
  const res = await fetch('/api/settings/districts', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  const raw = await res.json().catch(() => null);
  if (!res.ok) throw new Error(raw?.message ?? 'Failed to load districts');

  const rows = normalizeList<DistrictApiRow>(raw);

  return rows
    .map((r) => {
      const idNum = Number(r.id);
      if (!Number.isFinite(idNum)) return null;

      const districtName = pickText(r.name) || `District #${idNum}`;
      const divisionName = pickText(r.division_name, r.division?.name);

      return {
        id: idNum,
        districtName,
        divisionName,
        label: divisionName ? `${divisionName} - ${districtName}` : districtName,
      };
    })
    .filter(Boolean) as DistrictOption[];
}

export default function UpazilaTable() {
  const q = useUpazilas();
  const del = useDeleteUpazila();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<UpazilaRow | null>(null);

  const columns = useMemo<ColumnDef<UpazilaRow>[]>(() => {
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
        id: 'upazilaName',
        header: 'Upazila Name',
        sortable: true,
        sortValue: (r) => r.upazilaName,
        csvHeader: 'Upazila Name',
        csvValue: (r) => r.upazilaName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.upazilaName}</span>,
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
              setEditRow(r);
              setEditOpen(true);
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
            onClick={() => {
              const ok = window.confirm('Remove this upazila?');
              if (!ok) return;
              del.mutate(r.id);
            }}
            className="h-7 rounded-[4px] bg-[#FF5B5B] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-70"
          >
            Delete
          </button>
        ),
      },
    ];
  }, [del]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load upazilas.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#2B3A4A]">Overview of Upazila</h2>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95"
        >
          <Plus size={16} />
          Add Upazila
        </button>
      </div>

      <TablePanel<UpazilaRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.divisionName} ${r.districtName} ${r.upazilaName}`}
        exportFileName="upazilas.csv"
        exportLabel="Export to Excel"
        showTopBar={false}
      />

      <UpazilaFormModal
        mode="add"
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />

      <UpazilaFormModal
        mode="edit"
        open={editOpen}
        row={editRow}
        onClose={() => {
          setEditOpen(false);
          setEditRow(null);
        }}
      />
    </div>
  );
}

function UpazilaFormModal({
  mode,
  open,
  row,
  onClose,
}: {
  mode: 'add' | 'edit';
  open: boolean;
  row?: UpazilaRow | null;
  onClose: () => void;
}) {
  const districtsQ = useQuery({
    queryKey: ['settings', 'districts', 'options'],
    queryFn: fetchDistrictOptions,
    enabled: open, // only load when modal open
  });

  const createM = useCreateUpazila();
  const updateM = useUpdateUpazila();

  const [districtId, setDistrictId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const saving = createM.isPending || updateM.isPending;

  useEffect(() => {
    if (!open) return;

    setErr('');

    if (mode === 'edit' && row) {
      setName(row.upazilaName ?? '');
      // prefer districtId from API; fallback by matching districtName
      const opts = districtsQ.data ?? [];
      const fallback = opts.find((d) => d.districtName === row.districtName)?.id;

      setDistrictId(row.districtId ?? fallback ?? (opts[0]?.id ?? ''));
      return;
    }

    // add mode
    setName('');
    const first = districtsQ.data?.[0]?.id ?? '';
    setDistrictId(first);
  }, [open, mode, row, districtsQ.data]);

  const submit = async () => {
    setErr('');

    const did = typeof districtId === 'number' ? districtId : Number(districtId);
    if (!Number.isFinite(did)) return setErr('District is required');
    if (!name.trim()) return setErr('Upazila name is required');

    try {
      if (mode === 'add') {
        await createM.mutateAsync({ districtId: did, name: name.trim() });
      } else {
        const id = row?.id;
        if (!id) return setErr('Invalid upazila id');
        await updateM.mutateAsync({ id, districtId: did, name: name.trim() });
      }
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to save');
    }
  };

  return (
    <Modal
      open={open}
      title={mode === 'add' ? 'Add Upazila' : 'Edit Upazila'}
      onClose={onClose}
      maxWidthClassName="max-w-[560px]"
    >
      <div className="p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              District
            </label>

            <select
              value={districtId}
              onChange={(e) => setDistrictId(Number(e.target.value))}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              disabled={districtsQ.isLoading || districtsQ.isError}
            >
              {(districtsQ.data ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>

            {districtsQ.isError ? (
              <p className="mt-1 text-[11px] text-red-600">Failed to load districts.</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              Upazila Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              placeholder="Enter upazila name"
            />
          </div>

          {err ? <p className="text-[12px] font-medium text-red-600">{err}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
            >
              {saving ? 'Saving...' : mode === 'add' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
