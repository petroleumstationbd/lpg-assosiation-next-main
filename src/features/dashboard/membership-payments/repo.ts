import { normalizeList } from '@/lib/http/normalize';
import { toAbsoluteUrl } from '@/lib/http/url';
import type { PaymentRecordInput, PaymentRecordRow, StationOption } from './types';

type PaymentRecordApiRow = {
  id?: string | number | null;
  station_id?: string | number | null;
  station?: { id?: string | number | null; station_name?: string | null; name?: string | null };
  gas_station?: { id?: string | number | null; station_name?: string | null; name?: string | null };
  station_name?: string | null;
  bank_name?: string | null;
  amount_paid?: string | number | null;
  note?: string | null;
  payment_doc?: string | null;
  payment_doc_url?: string | null;
  created_at?: string | null;
};

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

function str(value: any, fallback = '') {
  const s = String(value ?? '').trim();
  return s || fallback;
}

function pick<T>(...values: Array<T | null | undefined>) {
  for (const value of values) {
    if (value != null && value !== ('' as any)) return value;
  }
  return undefined;
}

function toId(value: any) {
  const v = String(value ?? '').trim();
  return v || '';
}

function normalizeStoragePath(pathOrUrl: string) {
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.startsWith('/storage/')) return withLeadingSlash;
  return `/storage${withLeadingSlash}`;
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function mapRecord(row: PaymentRecordApiRow, idx: number): PaymentRecordRow | null {
  const id = toId(row?.id);
  if (!id) return null;

  const stationId = toId(
    pick(row?.station_id, row?.station?.id, row?.gas_station?.id)
  );
  const stationName = str(
    pick(
      row?.station_name,
      row?.station?.station_name,
      row?.gas_station?.station_name,
      row?.station?.name,
      row?.gas_station?.name
    ),
    stationId ? `Station #${stationId}` : '—'
  );
  const bankName = str(row?.bank_name, '—');
  const amountNum = Number(row?.amount_paid ?? 0);
  const amountPaid = Number.isFinite(amountNum) ? amountNum : 0;
  const note = str(row?.note, '');
  const paymentDocUrlRaw = pick(row?.payment_doc_url, row?.payment_doc);
  const paymentDocUrl = paymentDocUrlRaw
    ? toAbsoluteUrl(
        LARAVEL_ORIGIN,
        normalizeStoragePath(String(paymentDocUrlRaw))
      )
    : null;

  return {
    id,
    sl: idx + 1,
    stationId: stationId || undefined,
    stationName,
    bankName,
    amountPaid,
    note,
    paymentDocUrl,
    createdAt: str(row?.created_at, ''),
  };
}

export async function listPaymentRecords(): Promise<PaymentRecordRow[]> {
  const res = await fetch('/api/payment-records', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message ?? 'Failed to load payment records');

  return normalizeList<PaymentRecordApiRow>(data)
    .map(mapRecord)
    .filter(Boolean) as PaymentRecordRow[];
}

export async function createPaymentRecord(input: PaymentRecordInput) {
  const formData = new FormData();
  formData.append('station_id', input.stationId);
  formData.append('bank_name', input.bankName);
  formData.append('amount_paid', String(input.amountPaid));
  if (input.note) formData.append('note', input.note);
  formData.append('payment_doc', input.paymentDoc);

  const res = await fetch('/api/payment-records', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message ?? 'Failed to create payment record');
}

export async function deletePaymentRecord(id: string) {
  const res = await fetch(`/api/payment-records/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message ?? 'Failed to delete payment record');
}

export async function listUnverifiedStations(): Promise<StationOption[]> {
  const res = await fetch('/api/stations/unverified', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message ?? 'Failed to load stations');

  const rows = normalizeList<any>(data);

  return rows
    .map((row: any) => {
      const id = toId(row?.id);
      if (!id) return null;
      const name = str(
        pick(row?.station_name, row?.stationName, row?.name),
        `Station #${id}`
      );
      return { id, label: name };
    })
    .filter(Boolean) as StationOption[];
}
