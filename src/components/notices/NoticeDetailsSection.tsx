'use client';

import {useEffect, useState} from 'react';
import MeshCorners from '@/components/ui/MeshCorners';
import {toAbsoluteUrl} from '@/lib/http/url';

type NoticeAttachment = {
  id?: string;
  name: string;
  url: string;
};

type NoticeDetails = {
  title: string;
  content: string;
  publishDate: string;
  attachments: NoticeAttachment[];
};

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

function pickDate(v?: string | null) {
  if (!v) return '';
  const s = String(v);
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : s;
}

function normalizeAttachments(raw: any): NoticeAttachment[] {
  if (!raw) return [];

  if (Array.isArray(raw) && raw.length && typeof raw[0] === 'object') {
    return raw
      .map((item: any, idx: number) => {
        const fileUrl =
          item?.file_url ?? item?.url ?? item?.path ?? item?.file ?? '';
        if (!fileUrl) return null;
        const name =
          item?.original_name ?? item?.name ?? `Attachment ${idx + 1}`;
        return {
          id: item?.id ? String(item.id) : String(idx + 1),
          name: String(name),
          url: toAbsoluteUrl(LARAVEL_ORIGIN, String(fileUrl)),
        };
      })
      .filter(Boolean) as NoticeAttachment[];
  }

  if (Array.isArray(raw) && raw.every((x) => typeof x === 'string')) {
    return raw.map((fileUrl: string, idx: number) => ({
      id: String(idx + 1),
      name: `Attachment ${idx + 1}`,
      url: toAbsoluteUrl(LARAVEL_ORIGIN, fileUrl),
    }));
  }

  if (Array.isArray(raw?.data)) return normalizeAttachments(raw.data);

  return [];
}

function normalizeNotice(raw: any): NoticeDetails {
  const n = raw?.data ?? raw;
  return {
    title: n?.title ?? 'Notice Details',
    content: n?.content ?? '',
    publishDate: pickDate(n?.publish_date ?? n?.created_at ?? ''),
    attachments: normalizeAttachments(n?.attachments),
  };
}

export default function NoticeDetailsSection({id}: {id: string}) {
  const [notice, setNotice] = useState<NoticeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNotice() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/public/notices/${encodeURIComponent(id)}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load notice');
        const data = await res.json().catch(() => null);
        setNotice(normalizeNotice(data));
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        console.error('Failed to load notice', error);
        setErrorMsg('Unable to load notice details right now.');
        setNotice(null);
      } finally {
        setLoading(false);
      }
    }

    loadNotice();
    return () => controller.abort();
  }, [id]);

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <MeshCorners className="z-0" color="#2D8A2D" opacity={0.18} width={760} height={480} strokeWidth={1} />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <div className="mx-auto max-w-[860px] text-center">
          <h1 className="text-[30px] font-semibold tracking-tight text-[#133374] md:text-[36px]">
            {notice?.title ?? 'Notice Details'}
          </h1>
          {notice?.publishDate ? (
            <p className="mt-2 text-[12px] text-[#6F8093]">Published Date: {notice.publishDate}</p>
          ) : null}
        </div>

        <div className="mx-auto mt-8 max-w-[900px] rounded-[18px] bg-white/90 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)] backdrop-blur">
          {loading ? (
            <p className="text-[12px] text-[#6F8093]">Loading notice details...</p>
          ) : errorMsg ? (
            <p className="text-[12px] font-medium text-[#FC7160]">{errorMsg}</p>
          ) : notice ? (
            <>
              {notice.content ? (
                <div
                  className="prose max-w-none text-[13px] text-[#2B3A4A]"
                  dangerouslySetInnerHTML={{__html: notice.content}}
                />
              ) : (
                <p className="text-[13px] text-[#2B3A4A]">
                  Notice details are not available yet.
                </p>
              )}

              {notice.attachments.length ? (
                <div className="mt-6">
                  <h2 className="text-[13px] font-semibold text-[#133374]">Attachments</h2>
                  <ul className="mt-3 space-y-2 text-[12px] text-[#2B3A4A]">
                    {notice.attachments.map((file) => (
                      <li key={file.id ?? file.url} className="flex items-center justify-between gap-4">
                        <span className="truncate">{file.name}</span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex h-7 items-center justify-center rounded-[4px] bg-[#009970] px-3 text-[10px] font-semibold text-white transition hover:brightness-110">
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
