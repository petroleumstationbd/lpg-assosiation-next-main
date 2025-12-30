import {normalizeList} from '@/lib/http/normalize';
import type {DivisionRow} from './types';

type DivisionApiRow = {
  id: number | string;
  name?: string | null;
  is_active?: boolean | number | string | null;
};

export type DivisionCreateInput = {
  name: string;
  is_active?: boolean;
};

export type DivisionUpdateInput = Partial<DivisionCreateInput>;

export type DivisionRepo = {
  list: () => Promise<DivisionRow[]>;
  remove: (id: string) => Promise<void>;
  create: (input: DivisionCreateInput) => Promise<void>;
  update: (id: string, patch: DivisionUpdateInput) => Promise<void>;
};

const BASE = '/api/settings/divisions';

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

async function safeJson(res: Response) {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function mapRow(r: DivisionApiRow, idx: number): DivisionRow | null {
  const idNum = Number(r.id);
  if (!Number.isFinite(idNum)) return null;

  const name = (r.name ?? '').toString().trim();
  if (!name) return null;

  return {
    id: String(idNum),
    sl: idx + 1,
    name,
    isActive: toBool(r.is_active),
  };
}

export const divisionRepo: DivisionRepo = {
  async list() {
    const res = await fetch(BASE, {
      method: 'GET',
      cache: 'no-store',
      headers: {Accept: 'application/json'},
    });

    const raw = await safeJson(res);
    if (!res.ok) throw new Error(raw?.message ?? 'Failed to load divisions');

    const rows = normalizeList<DivisionApiRow>(raw);
    return rows.map(mapRow).filter(Boolean) as DivisionRow[];
  },

  async remove(id: string) {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) throw new Error('Invalid division id');

    const res = await fetch(`${BASE}/${idNum}`, {
      method: 'DELETE',
      headers: {Accept: 'application/json'},
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to delete division');
  },

  async create(input: DivisionCreateInput) {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(input),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to create division');
  },

  async update(id: string, patch: DivisionUpdateInput) {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) throw new Error('Invalid division id');

    const res = await fetch(`${BASE}/${idNum}`, {
      method: 'PUT',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(patch),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to update division');
  },
};
