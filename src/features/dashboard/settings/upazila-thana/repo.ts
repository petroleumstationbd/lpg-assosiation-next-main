import { normalizeList } from '@/lib/http/normalize';
import type { UpazilaRow } from './types';

type UpazilaApiRow = {
  id: number | string;
  name?: string | null;

  // common variants
  district_id?: number | string | null;
  district_name?: string | null;
  division_name?: string | null;

  district?: {
    id?: number | string | null;
    name?: string | null;
    division?: { name?: string | null } | null;
  } | null;
};

export type UpazilaRepo = {
  list: () => Promise<UpazilaRow[]>;
  remove: (id: string) => Promise<void>;
  create: (input: { districtId: number; name: string; isActive?: boolean }) => Promise<void>;
  update: (
    id: string,
    patch: { districtId?: number; name?: string; isActive?: boolean }
  ) => Promise<void>;
};

function pickText(...vals: Array<unknown>) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

export const upazilaRepo: UpazilaRepo = {
  async list() {
    const res = await fetch('/api/settings/upazilas', {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    const raw = await res.json().catch(() => null);
    if (!res.ok) throw new Error(raw?.message ?? 'Failed to load upazilas');

    const rows = normalizeList<UpazilaApiRow>(raw);

    return rows
      .map((r, idx): UpazilaRow | null => {
        const idNum = Number(r.id);
        if (!Number.isFinite(idNum)) return null;

        const districtIdNum = Number(r.district_id ?? r.district?.id);
        const districtId = Number.isFinite(districtIdNum) ? districtIdNum : null;

        const upazilaName = pickText(r.name) || `Upazila #${idNum}`;

        const districtName =
          pickText(r.district_name, r.district?.name) ||
          (districtId ? `District #${districtId}` : '');

        const divisionName = pickText(r.division_name, r.district?.division?.name);

        return {
          id: String(idNum),
          sl: idx + 1,
          divisionName,
          districtName,
          upazilaName,
          districtId,
        };
      })
      .filter(Boolean) as UpazilaRow[];
  },

  async remove(id: string) {
    const res = await fetch(`/api/settings/upazilas/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to delete upazila');
  },

  async create(input) {
    const payload = {
      district_id: input.districtId,
      name: input.name,
      is_active: input.isActive ?? true,
    };

    const res = await fetch('/api/settings/upazilas', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to create upazila');
  },

  async update(id, patch) {
    const payload: any = {};
    if (typeof patch.name === 'string') payload.name = patch.name;
    if (typeof patch.districtId === 'number') payload.district_id = patch.districtId;
    if (typeof patch.isActive === 'boolean') payload.is_active = patch.isActive;

    const res = await fetch(`/api/settings/upazilas/${id}`, {
      method: 'PUT',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to update upazila');
  },
};
