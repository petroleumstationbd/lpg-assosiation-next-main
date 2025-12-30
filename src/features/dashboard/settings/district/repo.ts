import type { DistrictRow } from './types';
import { normalizeList } from '@/lib/http/normalize';

type DistrictApiRow = {
  id: number | string;
  name?: string | null;

  division_id?: number | string | null;
  division_name?: string | null;
  division?: { id?: number | string; name?: string | null } | null;

  is_active?: boolean | number | string | null;
};

export type DistrictCreateInput = {
  division_id: number;
  name: string;
  is_active?: boolean;
};

export type DistrictUpdateInput = Partial<DistrictCreateInput>;

export type DistrictRepo = {
  list: () => Promise<DistrictRow[]>;
  remove: (id: string) => Promise<void>;
  create: (input: DistrictCreateInput) => Promise<void>;
  update: (id: string, patch: DistrictUpdateInput) => Promise<void>;
};

const BASE = '/api/settings/districts';

function toBool(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') {
    const t = v.trim().toLowerCase();
    if (t === '1' || t === 'true') return true;
    if (t === '0' || t === 'false') return false;
  }
  return undefined;
}

function mapRow(r: DistrictApiRow, idx: number): DistrictRow | null {
  const idNum = Number(r.id);
  if (!Number.isFinite(idNum)) return null;

  const divisionIdNum = r.division_id != null ? Number(r.division_id) : NaN;

  const divisionName =
    (r.division?.name ?? r.division_name ?? '').toString().trim() ||
    (Number.isFinite(divisionIdNum) ? `Division #${divisionIdNum}` : '');

  const districtName = (r.name ?? '').toString().trim() || `District #${idNum}`;

  return {
    id: String(idNum),
    sl: idx + 1,
    divisionName,
    districtName,
    divisionId: Number.isFinite(divisionIdNum) ? divisionIdNum : undefined,
    isActive: toBool(r.is_active),
  };
}

async function safeJson(res: Response) {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

export const districtRepo: DistrictRepo = {
  async list() {
    const res = await fetch(BASE, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    const raw = await safeJson(res);
    if (!res.ok) throw new Error(raw?.message ?? 'Failed to load districts');

    const rows = normalizeList<DistrictApiRow>(raw);
    return rows.map(mapRow).filter(Boolean) as DistrictRow[];
  },

  async remove(id: string) {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) throw new Error('Invalid district id');

    const res = await fetch(`${BASE}/${idNum}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to delete district');
  },

  async create(input) {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to create district');
  },

  async update(id, patch) {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) throw new Error('Invalid district id');

    const res = await fetch(`${BASE}/${idNum}`, {
      method: 'PUT',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to update district');
  },
};
