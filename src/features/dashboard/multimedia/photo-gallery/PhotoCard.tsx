'use client';

import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import Modal from '@/components/ui/modal/Modal';
import type { GalleryAlbum } from './types';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

type Props = {
  item: GalleryAlbum;
  onView?: (id: number) => void; // image/title click (navigate)
  onEdit?: (id: number) => void; // optional (not used now; kept for compatibility)
  onDelete?: (id: number) => void;
  onUpdated?: () => void | Promise<void>; // optional: pass load() from parent for smooth refresh
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isStaticImageData(v: unknown): v is StaticImageData {
  return (
    !!v &&
    typeof v === 'object' &&
    typeof (v as any).src === 'string' &&
    typeof (v as any).width === 'number' &&
    typeof (v as any).height === 'number'
  );
}

function toDateInputValue(v?: string | null) {
  const t = (v ?? '').trim();
  if (!t) return '';
  // if already yyyy-mm-dd keep it
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  // try ISO -> yyyy-mm-dd
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isImageFile(f: File) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
}

async function updateAlbumRequest(id: number, buildFd: () => FormData) {
  // 1) try PUT (if your Next route supports PUT)
  try {
    const resPut = await fetch(`/api/albums/${id}`, {
      method: 'PUT',
      headers: { Accept: 'application/json' },
      body: buildFd(),
    });
    // If route exists and not "method not allowed", return it.
    if (resPut.status !== 405) return resPut;
  } catch {
    // ignore, fallback
  }

  // 2) fallback: POST + _method=PUT (Laravel style + your previous pattern)
  const fd = buildFd();
  fd.set('_method', 'PUT');

  return fetch(`/api/albums/${id}`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: fd,
  });
}

export default function PhotoCard({ item, onView, onDelete, onUpdated }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const cover = item?.cover;

  const coverSrc: string | StaticImageData | null = isNonEmptyString(cover)
    ? cover
    : isStaticImageData(cover)
      ? cover
      : null;

  const canRenderImage = Boolean(coverSrc);

  const openPreview = () => {
    if (!coverSrc) return;
    setPreviewOpen(true);
  };

  useEffect(() => {
    if (!editOpen) return;
    setTitle((item?.title ?? '').trim());
    setEventDate(toDateInputValue(item?.eventDate ?? null));
    setCoverFile(null);
    setSaving(false);
    setErr('');
  }, [editOpen, item]);

  const submitEdit = async () => {
    setErr('');

    const id = item?.id;
    if (!Number.isFinite(id)) {
      setErr('Invalid album id');
      return;
    }

    const t = title.trim();
    if (!t) {
      setErr('Title is required');
      return;
    }

    if (coverFile) {
      if (!isImageFile(coverFile)) {
        setErr('Cover must be PNG/JPG/WEBP');
        return;
      }
      // backend says max 10MB
      if (coverFile.size > 10 * 1024 * 1024) {
        setErr('Cover must be <= 10MB');
        return;
      }
    }

    const buildFd = () => {
      const fd = new FormData();
      fd.set('title', t);
      if (eventDate) fd.set('event_date', eventDate);
      if (coverFile) fd.set('cover', coverFile);
      return fd;
    };

    setSaving(true);
    try {
      const res = await updateAlbumRequest(id, buildFd);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(data?.message ?? 'Failed to update album');
        return;
      }

      setEditOpen(false);

      if (onUpdated) {
        await onUpdated();
      } else {
        // fallback: ensure you see the updated cover/title immediately
        window.location.reload();
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-[14px] bg-[#F4F6FF] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
        <div className="p-4">
          <div
            className="overflow-hidden rounded-[14px] bg-white"
            role={onView ? 'button' : undefined}
            tabIndex={onView ? 0 : undefined}
            onClick={() => onView?.(item.id)}
            onKeyDown={(e) => {
              if (!onView) return;
              if (e.key === 'Enter' || e.key === ' ') onView(item.id);
            }}
          >
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt={item?.title || 'Album'}
                className="h-[170px] w-full object-cover"
                width={1200}
                height={700}
                priority={false}
              />
            ) : (
              <div className="h-[170px] w-full bg-white" />
            )}
          </div>

          <div className="mt-3">
            <div className="line-clamp-1 text-[12px] font-semibold text-[#133374]">
              {item?.title}
            </div>
            {item?.eventDate ? (
              <div className="mt-1 text-[10px] text-slate-500">{item.eventDate}</div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 pb-1">
            <button
              type="button"
              onClick={openPreview}
              aria-label="View"
              className={cx(
                'grid h-9 w-9 place-items-center rounded-full text-white shadow-sm transition active:scale-[0.98]',
                'bg-[#2F6DF6] hover:brightness-110'
              )}
              disabled={!canRenderImage}
              title={!canRenderImage ? 'No cover image' : undefined}
            >
              <Eye size={18} />
            </button>
{/* 
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              aria-label="Edit"
              className={cx(
                'grid h-9 w-9 place-items-center rounded-full text-white shadow-sm transition active:scale-[0.98]',
                'bg-[#21B35B] hover:brightness-110'
              )}
            >
              <Pencil size={18} />
            </button> */}

            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              aria-label="Delete"
              className={cx(
                'grid h-9 w-9 place-items-center rounded-full text-white shadow-sm transition active:scale-[0.98]',
                'bg-[#E64545] hover:brightness-110'
              )}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <Modal
        open={previewOpen}
        title={item?.title || 'Preview'}
        onClose={() => setPreviewOpen(false)}
        maxWidthClassName="max-w-[900px]"
      >
        <div className="p-4">
          {coverSrc ? (
            <div className="overflow-hidden rounded-[10px] bg-white">
              <Image
                src={coverSrc}
                alt={item?.title || 'Album'}
                width={1600}
                height={1000}
                className="h-auto w-full object-contain"
                priority={false}
              />
            </div>
          ) : (
            <p className="text-[12px] text-[#7B8EA3]">No cover image.</p>
          )}
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        title="Edit Album"
        onClose={() => setEditOpen(false)}
        maxWidthClassName="max-w-[560px]"
      >
        <div className="p-4">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
                placeholder="Album title"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Event date (optional)
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Replace cover (optional)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="block w-full text-[12px]"
              />
            </div>

            {err && <p className="text-[12px] font-medium text-red-600">{err}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitEdit}
                disabled={saving}
                className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
