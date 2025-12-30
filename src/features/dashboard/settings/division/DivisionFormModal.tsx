'use client';

import {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import type {DivisionRow} from './types';

const DIVISION_NAMES = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Sylhet',
] as const;

type DivisionName = (typeof DIVISION_NAMES)[number];

function isDivisionName(v: string): v is DivisionName {
  return (DIVISION_NAMES as readonly string[]).includes(v);
}

export default function DivisionFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  saving,
  error,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: DivisionRow | null;
  onClose: () => void;
  onSubmit: (payload: {name: string; is_active?: boolean}) => void;
  saving?: boolean;
  error?: string;
}) {
  const [name, setName] = useState<DivisionName>('Dhaka');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;

    const initName = (initial?.name ?? 'Dhaka').trim();
    setName(isDivisionName(initName) ? initName : 'Dhaka');
    setIsActive(initial?.isActive ?? true);
  }, [open, initial]);

  const title = mode === 'create' ? 'Add Division' : 'Edit Division';

  const canSubmit = useMemo(() => !!name && name.trim().length > 0, [name]);

  return (
    <Modal open={open} title={title} onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              Division Name
            </label>

            <select
              value={name}
              onChange={(e) => setName(e.target.value as DivisionName)}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
            >
              {DIVISION_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-[12px] text-[#2B3A4A]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>

          {error ? <p className="text-[12px] font-medium text-red-600">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={!!saving}
              className="h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!!saving || !canSubmit}
              onClick={() => onSubmit({name, is_active: isActive})}
              className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
            >
              {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
