'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import { normalizeList } from '@/lib/http/normalize';
import type { DistrictRow } from './types';

type DivisionApiRow = {
  id: number | string;
  name?: string | null;
  is_active?: boolean | number | string | null;
};

type DivisionOpt = { id: number; name: string };

async function safeJson(res: Response) {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function toOpt(r: DivisionApiRow): DivisionOpt | null {
  const id = Number(r.id);
  if (!Number.isFinite(id)) return null;
  const name = (r.name ?? '').toString().trim();
  if (!name) return null;
  return { id, name };
}

export default function DistrictFormModal({
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
  initial?: DistrictRow | null;
  onClose: () => void;
  onSubmit: (payload: { division_id: number; name: string; is_active?: boolean }) => void;
  saving?: boolean;
  error?: string;
}) {
  const [divisionId, setDivisionId] = useState<number>(0);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [divisions, setDivisions] = useState<DivisionOpt[]>([]);
  const [loadingDivs, setLoadingDivs] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName(initial?.districtName ?? '');
    setDivisionId(initial?.divisionId ?? 0);
    setIsActive(initial?.isActive ?? true);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoadingDivs(true);
      try {
        const res = await fetch('/api/settings/divisions', {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        const raw = await safeJson(res);
        if (!res.ok) return;

        const rows = normalizeList<DivisionApiRow>(raw);
        const opts = rows.map(toOpt).filter(Boolean) as DivisionOpt[];

        setDivisions(opts);

        // If editing and divisionId missing, try match by name
        if (!initial?.divisionId && initial?.divisionName) {
          const hit = opts.find((x) => x.name === initial.divisionName);
          if (hit) setDivisionId(hit.id);
        }
      } finally {
        setLoadingDivs(false);
      }
    };

    void load();
  }, [open, initial?.divisionId, initial?.divisionName]);

  const title = mode === 'create' ? 'Add District' : 'Edit District';

  const canSubmit = useMemo(() => {
    return Number.isFinite(divisionId) && divisionId > 0 && name.trim().length > 0;
  }, [divisionId, name]);

  return (
    <Modal open={open} title={title} onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              Division
            </label>

            <select
              value={divisionId || 0}
              onChange={(e) => setDivisionId(Number(e.target.value))}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              disabled={loadingDivs}
            >
              <option value={0}>Select Division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {!loadingDivs && divisions.length === 0 ? (
              <p className="mt-1 text-[11px] text-[#7B8EA3]">
                No divisions found. Create a division first.
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              District Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              placeholder="District name"
            />
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
              onClick={() => onSubmit({ division_id: divisionId, name: name.trim(), is_active: isActive })}
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
