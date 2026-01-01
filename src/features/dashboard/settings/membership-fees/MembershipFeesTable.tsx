'use client';

import {useMemo, useState} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import type {MembershipFeeRow} from './types.ts';
import {
  useCreateMembershipFee,
  useDeleteMembershipFee,
  useMembershipFees,
  useUpdateMembershipFee,
} from './queries';
import MembershipFeeFormModal from './MembershipFeeFormModal';

const BRAND = '#009970';

const btnBase =
  'h-7 rounded-[4px] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95';

const btnTop =
  'inline-flex h-9 items-center justify-center gap-2 rounded-[6px] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95';

export default function MembershipFeesTable() {
  const q = useMembershipFees();
  const del = useDeleteMembershipFee();
  const createM = useCreateMembershipFee();
  const updateM = useUpdateMembershipFee();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [activeRow, setActiveRow] = useState<MembershipFeeRow | null>(null);
  const [formError, setFormError] = useState('');

  const columns = useMemo<ColumnDef<MembershipFeeRow>[]>(() => {
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
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'amount',
        header: 'Amount',
        sortable: true,
        sortValue: (r) => r.amount,
        csvHeader: 'Amount',
        csvValue: (r) => r.amount,
        cell: (r) => <span className="text-[#2B3A4A]">{r.amount.toFixed(2)}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        sortValue: (r) => r.status,
        align: 'center',
        headerClassName: 'w-[160px]',
        csvHeader: 'Status',
        csvValue: (r) => r.status,
        cell: (r) => (
          <span
            className={
              r.status === 'ACTIVE'
                ? 'font-semibold text-[#2D8A2D]'
                : 'font-semibold text-[#E24A3B]'
            }
          >
            {r.status}
          </span>
        ),
      },
      {
        id: 'edit',
        header: 'Edit',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Edit',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setMode('edit');
              setActiveRow(r);
              setOpen(true);
            }}
            className={`${btnBase} bg-[#133374]`}
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
        headerClassName: 'w-[150px]',
        csvHeader: 'Delete',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => del.mutate(r.id)}
            disabled={del.isPending}
            className={`${btnBase} bg-[#FC7160] disabled:opacity-60`}
          >
            Delete
          </button>
        ),
      },
    ];
  }, [del.isPending]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load fees.</div>;

  return (
    <div className="space-y-4">
      {/* plain text header like Invoice page */}
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">
        Overview of Membership Fees
      </h2>

      <TablePanel<MembershipFeeRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.amount} ${r.status}`}
        showExport={false}
        totalLabel={(total) => (
          <div className="text-[14px] font-semibold text-[#2D8A2D]">
            Total Fee Structures : <span className="text-[#133374]">{total}</span>
          </div>
        )}
        controlsRightSlot={
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setMode('create');
              setActiveRow(null);
              setOpen(true);
            }}
            className={btnTop}
            style={{backgroundColor: BRAND}}
          >
            Add Fee Structure
          </button>
        }
      />

      <MembershipFeeFormModal
        open={open}
        mode={mode}
        initial={activeRow}
        onClose={() => {
          setOpen(false);
          setActiveRow(null);
          setFormError('');
        }}
        saving={createM.isPending || updateM.isPending}
        error={formError}
        onSubmit={async (payload) => {
          setFormError('');
          if (!Number.isFinite(payload.amount)) {
            setFormError('Amount must be a number');
            return;
          }

          try {
            if (mode === 'create') {
              await createM.mutateAsync(payload);
            } else {
              if (!activeRow?.id) {
                setFormError('Invalid membership fee id');
                return;
              }
              await updateM.mutateAsync({id: activeRow.id, patch: payload});
            }

            setOpen(false);
            setActiveRow(null);
          } catch (e: any) {
            setFormError(e?.message ?? 'Failed to save membership fee');
          }
        }}
      />
    </div>
  );
}
