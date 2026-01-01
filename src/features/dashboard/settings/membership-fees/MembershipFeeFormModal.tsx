'use client';

import {useEffect, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import type {FeeStatus, MembershipFeeInput, MembershipFeeRow} from './types';

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: MembershipFeeRow | null;
  saving?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: MembershipFeeInput) => void | Promise<void>;
};

const statusOptions: FeeStatus[] = ['ACTIVE', 'INACTIVE'];

export default function MembershipFeeFormModal({
  open,
  mode,
  initial,
  saving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '');
  const [status, setStatus] = useState<FeeStatus>(initial?.status ?? 'ACTIVE');

  const title = mode === 'create' ? 'Add Membership Fee' : 'Edit Membership Fee';

  useEffect(() => {
    if (!open) return;
    setAmount(initial?.amount?.toString() ?? '');
    setStatus(initial?.status ?? 'ACTIVE');
  }, [open, initial]);

  return (
    <Modal open={open} title={title} onClose={onClose} maxWidthClassName="max-w-[520px]">
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const amountNum = Number(amount);
          if (!Number.isFinite(amountNum)) return;

          onSubmit({
            amount: amountNum,
            status,
          });
        }}
      >
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="e.g. 6000"
            inputMode="decimal"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as FeeStatus)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {error ? <div className="text-[12px] text-red-600">{error}</div> : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[6px] border border-[#E5E7EB] px-4 text-[12px] font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
