import type { CreateNoticeInput, NoticeApiItem, NoticeRow } from './types';

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

function toAbsoluteUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${LARAVEL_ORIGIN}${p}`;
}

function normalizeList(raw: any): NoticeApiItem[] {
  if (Array.isArray(raw)) return raw as NoticeApiItem[];
  if (Array.isArray(raw?.data)) return raw.data as NoticeApiItem[];
  return [];
}

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? 'Request failed');
  return data;
}

function formatPublishDate(api: NoticeApiItem) {
  const v = api.publish_date ?? api.created_at ?? api.updated_at ?? '';
  if (!v) return '';
  if (typeof v === 'string' && v.includes('T')) return v.split('T')[0];
  return String(v);
}

function firstAttachmentHref(api: NoticeApiItem) {
  const atts = api.attachments ?? [];
  if (!Array.isArray(atts) || atts.length === 0) return undefined;

  const first = atts[0];
  if (typeof first === 'string') return toAbsoluteUrl(first) ?? undefined;

  const url = first?.url ?? first?.path ?? first?.file;
  return toAbsoluteUrl(url ?? null) ?? undefined;
}

function buildNoticeFormData(input: CreateNoticeInput) {
  const fd = new FormData();

  fd.set('title', input.title);
  fd.set('content', input.content);

  // Keep both supported: older doc => audience, newer doc => publish_date
  fd.set('audience', input.audience);

  if (input.publishDate?.trim()) {
    fd.set('publish_date', input.publishDate.trim());
  }

  for (const f of input.attachments ?? []) {
    fd.append('attachments[]', f);
  }

  return fd;
}

export const noticesRepo = {
  async list(): Promise<NoticeRow[]> {
    const res = await fetch('/api/notices', { cache: 'no-store' });
    const raw = await readJsonOrThrow(res);
    const list = normalizeList(raw);

    return list.map((n, idx) => ({
      id: String(n.id),
      sl: idx + 1,
      title: n.title,
      publishDate: formatPublishDate(n),
      href: firstAttachmentHref(n),
    }));
  },

  async create(input: CreateNoticeInput) {
    const fd = buildNoticeFormData(input);

    const res = await fetch('/api/notices', {
      method: 'POST',
      body: fd,
    });

    return readJsonOrThrow(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    await readJsonOrThrow(res);
  },
};
