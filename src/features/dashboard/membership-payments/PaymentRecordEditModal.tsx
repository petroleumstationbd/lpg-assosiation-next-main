'use client';

import {useEffect, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import type {PaymentRecordRow, PaymentRecordUpdateInput} from './types';

type Props = {
  open: boolean;
  record: PaymentRecordRow | null;
  saving?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: PaymentRecordUpdateInput) => void | Promise<void>;
};

export default function PaymentRecordEditModal({
  open,
  record,
  saving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [bankName, setBankName] = useState(record?.bankName ?? '');
  const [amountPaid, setAmountPaid] = useState(
    record?.amountPaid != null ? String(record.amountPaid) : ''
  );
  const [note, setNote] = useState(record?.note ?? '');
  const [paymentDoc, setPaymentDoc] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    setBankName(record?.bankName ?? '');
    setAmountPaid(record?.amountPaid != null ? String(record.amountPaid) : '');
    setNote(record?.note ?? '');
    setPaymentDoc(null);
  }, [open, record]);

  return (
    <Modal
      open={open}
      title="Edit Payment Record"
      onClose={onClose}
      maxWidthClassName="max-w-[640px]"
    >
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const amountNum = Number(amountPaid);
          if (!Number.isFinite(amountNum) || amountNum <= 0) return;

          onSubmit({
            bankName: bankName.trim(),
            amountPaid: amountNum,
            note: note.trim(),
            paymentDoc,
          });
        }}
      >
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Bank Name
          </label>
          <input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="Enter bank name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Amount Paid
          </label>
          <input
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="Enter amount paid"
            inputMode="decimal"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="Optional note"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Replace Document (optional)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setPaymentDoc(e.target.files?.[0] ?? null)}
            className="block w-full text-[12px]"
          />
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
            className="h-9 rounded-[6px] bg-[#133374] px-4 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
