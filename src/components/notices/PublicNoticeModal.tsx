'use client';

import {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import {toAbsoluteUrl} from '@/lib/http/url';

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

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

type Props = {
  open: boolean;
  noticeId: string | null;
  title?: string;
  publishedDate?: string;
  onClose: () => void;
};

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

export default function PublicNoticeModal({
  open,
  noticeId,
  title,
  publishedDate,
  onClose,
}: Props) {
  const [notice, setNotice] = useState<NoticeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fallback = useMemo<NoticeDetails>(
    () => ({
      title: title ?? 'Notice Details',
      content: '',
      publishDate: publishedDate ?? '',
      attachments: [],
    }),
    [title, publishedDate]
  );

  useEffect(() => {
    if (!open) return;

    if (!noticeId) {
      setNotice(fallback);
      setLoading(false);
      setErrorMsg(null);
      return;
    }

    const controller = new AbortController();

    async function loadNotice() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/public/notices/${encodeURIComponent(noticeId)}`, {
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
        setNotice(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadNotice();
    return () => controller.abort();
  }, [fallback, noticeId, open]);

  return (
    <Modal
      open={open}
      title={notice?.title ?? 'Notice Details'}
      onClose={onClose}
      maxWidthClassName="max-w-[920px]"
    >
      <div className="space-y-4 p-5 text-[13px] text-[#2B3A4A]">
        {loading ? (
          <p className="text-[12px] text-[#6F8093]">Loading notice details...</p>
        ) : null}

        {errorMsg ? (
          <p className="text-[12px] font-medium text-[#FC7160]">{errorMsg}</p>
        ) : null}

        {notice ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold text-[#133374]">{notice.title}</h3>
              {notice.publishDate ? (
                <p className="text-[12px] text-[#6F8093]">Published Date: {notice.publishDate}</p>
              ) : null}
            </div>

            {notice.content ? (
              <div
                className="prose max-w-none text-[13px] text-[#2B3A4A]"
                dangerouslySetInnerHTML={{__html: notice.content}}
              />
            ) : (
              <p className="text-[13px] text-[#2B3A4A]">Notice details are not available yet.</p>
            )}

            {notice.attachments.length ? (
              <div>
                <h4 className="text-[13px] font-semibold text-[#133374]">Attachments</h4>
                <ul className="mt-3 space-y-2 text-[12px] text-[#2B3A4A]">
                  {notice.attachments.map((file) => (
                    <li key={file.id ?? file.url} className="flex items-center justify-between gap-4">
                      <span className="truncate">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex h-7 items-center justify-center rounded-[4px] bg-[#009970] px-3 text-[10px] font-semibold text-white transition hover:brightness-110"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
