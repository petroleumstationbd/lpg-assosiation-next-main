'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import PhotoCard from './PhotoCard';
import type { GalleryAlbum } from './types';

import CreateAlbumModal from '@components/ui/modal/CreateAlbumModal';

import { normalizeList } from '@/lib/http/normalize';
import { toAbsoluteUrl } from '@/lib/http/url';

type AlbumApiRow = {
  id: number | string;
  title?: string | null;

  // response keys
  cover_url?: string | null;
  event_date?: string | null;

  // possible variants (keep defensive)
  cover?: string | null;
  cover_path?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

function formatDateLite(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function mapAlbumRow(r: AlbumApiRow): GalleryAlbum | null {
  const id = Number(r.id);
  if (!Number.isFinite(id)) return null;

  const origin =
    process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

  // API returns cover_url (relative) or null
  const rel = (r.cover_url ?? r.cover ?? r.cover_path ?? '').trim();
  const cover = rel ? toAbsoluteUrl(origin, rel) : null;

  const title = (r.title ?? '').trim() || `Album #${id}`;

  const eventDate = r.event_date
    ? formatDateLite(r.event_date)
    : formatDateLite(r.created_at ?? r.updated_at) || null;

  return { id, title, cover, eventDate };
}

export default function PhotoGallerySection() {
  const router = useRouter();

  const [items, setItems] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const gridItems = useMemo(() => items, [items]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/albums', {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      const raw = await res.json().catch(() => null);
      if (!res.ok) return;

      const rows = normalizeList<AlbumApiRow>(raw);

      // IMPORTANT: filter out null to avoid item undefined issues
      const next = rows
        .map(mapAlbumRow)
        .filter((x): x is GalleryAlbum => Boolean(x));

      setItems(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: number) => {
    if (!Number.isFinite(id)) return;

    const ok = window.confirm('Remove this album?');
    if (!ok) return;

    const snapshot = items;
    setItems((p) => p.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/albums/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setItems(snapshot);
        window.alert(data?.message ?? 'Failed to delete album');
      }
    } catch {
      setItems(snapshot);
      window.alert('Network error. Please try again.');
    }
  };

  const onCreate = async (payload: {
    title: string;
    eventDate?: string;
    cover?: File | null;
  }) => {
    const title = String(payload?.title ?? '').trim();
    const eventDate = String(payload?.eventDate ?? '').trim();
    const coverFile = (payload?.cover ?? null) as File | null;

    if (!title) {
      window.alert('Title is required');
      return;
    }

    const fd = new FormData();
    fd.set('title', title);
    if (eventDate) fd.set('event_date', eventDate); // API expects event_date
    if (coverFile) fd.set('cover', coverFile); // API expects cover

    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fd,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      window.alert(data?.message ?? 'Failed to create album');
      return;
    }

    setOpenCreate(false);
    await load();
  };

  return (
    <section className="min-w-0">
      <div className="grid grid-cols-3 items-center">
        <div />
        <h2 className="text-center text-[16px] font-medium text-[#133374]">
          Photo Gallery
        </h2>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white"
          >
            Create New Album
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {gridItems.map((item) => (
          <PhotoCard
            key={item.id}
            item={item}
            // keep simple: click image/title (not the eye) to visit album page
            onView={(id) => router.push(`/multimedia/photo-gallery/${id}`)}
            onEdit={(id) => router.push(`/multimedia/photo-gallery/${id}`)}
            onDelete={onDelete}
          />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="mt-8 text-center text-[12px] text-[#7B8EA3]">
          No albums found.
        </p>
      )}

      <CreateAlbumModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={onCreate}
      />
    </section>
  );
}
