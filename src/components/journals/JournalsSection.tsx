'use client';

import {useEffect, useState} from 'react';
import GridCardSection from '@/components/shared/GridCardsSection';
import type {AlbumCardData} from '@/components/shared/GridCardsSection/Card';
import {toAbsoluteUrl} from '@/lib/http/url';
import PublicJournalModal from './PublicJournalModal';
import placeholderImage from '@/components/PrintMediaGallery/img/news1.png';

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
  'https://admin.petroleumstationbd.com';

const DEFAULT_DESCRIPTION =
  "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.";

type JournalApiItem = {
  id?: number | string;
  public_id?: number | string;
  journal_id?: number | string;
  title?: string | null;
  type?: string | null;
  description?: string | null;
  publish_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  file?: string | null;
  file_url?: string | null;
  file_path?: string | null;
  document?: string | null;
  document_url?: string | null;
  is_active?: boolean | number | string | null;
};

type JournalItem = {
  id: number;
  publicId?: string;
  title: string;
  type: 'video' | 'image' | 'document';
  description: string;
  publishDate: string;
  fileUrl: string;
};

function normalizeList(raw: any) {
  if (Array.isArray(raw)) return raw as JournalApiItem[];
  if (Array.isArray(raw?.data)) return raw.data as JournalApiItem[];
  if (Array.isArray(raw?.data?.data)) return raw.data.data as JournalApiItem[];
  return [] as JournalApiItem[];
}

function pickDate(value?: string | null) {
  if (!value) return '';
  const s = String(value);
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : s;
}

function resolveFileUrl(item: JournalApiItem) {
  const direct =
    item.file ??
    item.file_url ??
    item.file_path ??
    item.document ??
    item.document_url ??
    null;
  if (direct) return toAbsoluteUrl(LARAVEL_ORIGIN, direct);
  return '';
}

function normalizeType(value?: string | null): JournalItem['type'] {
  if (value === 'video' || value === 'image' || value === 'document') return value;
  return 'document';
}

function isActive(item: JournalApiItem) {
  if (item.is_active === false) return false;
  if (typeof item.is_active === 'string') return item.is_active !== '0';
  if (typeof item.is_active === 'number') return item.is_active !== 0;
  return true;
}

function mapJournal(item: JournalApiItem, idx: number): JournalItem {
  const id = Number(item.id ?? idx + 1);
  const publicId = item.public_id ?? item.journal_id;

  return {
    id,
    publicId: publicId ? String(publicId) : undefined,
    title: item.title ?? `Journal ${idx + 1}`,
    type: normalizeType(item.type),
    description: item.description ?? DEFAULT_DESCRIPTION,
    publishDate: pickDate(item.publish_date ?? item.created_at ?? item.updated_at),
    fileUrl: resolveFileUrl(item),
  };
}

export default function JournalsSection() {
  const [cards, setCards] = useState<AlbumCardData[]>([]);
  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [active, setActive] = useState<JournalItem | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('/api/public/journals/list', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to load journals');
        const data = await res.json().catch(() => null);
        const list = normalizeList(data).filter(isActive);

        const mapped = list.map(mapJournal);
        setJournals(mapped);

        const cardData: AlbumCardData[] = mapped.map((item) => {
          const hasMedia =
            (item.type === 'video' || item.type === 'image') && Boolean(item.fileUrl);
          return {
            id: item.id,
            title: item.title,
            date: item.publishDate,
            description: item.description,
            image:
              item.type === 'image' && item.fileUrl
                ? item.fileUrl
                : placeholderImage,
            videos: hasMedia,
            videoUrl:
              item.type === 'video' || item.type === 'image' ? item.fileUrl : null,
          };
        });

        setCards(cardData);
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        console.error('Failed to load journals', error);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <>
      <GridCardSection
        sectionCardData={cards}
        title="Journals"
        description={DEFAULT_DESCRIPTION}
        onPlay={(album) => {
          const match = journals.find((item) => item.id === album.id);
          if (!match) return;
          if (match.type !== 'image' && match.type !== 'video') return;
          setActive(match);
          setViewOpen(true);
        }}
      />

      <PublicJournalModal
        open={viewOpen}
        journalId={active?.publicId ?? (active ? String(active.id) : null)}
        title={active?.title}
        publishedDate={active?.publishDate}
        description={active?.description}
        type={active?.type}
        fileUrl={active?.fileUrl}
        onClose={() => setViewOpen(false)}
      />
    </>
  );
}
