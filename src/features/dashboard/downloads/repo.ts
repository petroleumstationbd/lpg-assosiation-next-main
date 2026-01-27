import {env} from '@/lib/env';
import {toAbsoluteUrl} from '@/lib/http/url';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_DOCUMENTS} from './mock';
import type {
   DownloadDocumentInput,
   DownloadDocumentRow,
   DownloadDocumentStatus,
} from './types';

type DownloadableDocumentApiItem = {
   id?: number | string;
   title?: string | null;
   publish_date?: string | null;
   status?: string | null;
   document?: string | null;
   document_url?: string | null;
   file_path?: string | null;
   url?: string | null;
   file?: string | null;
};

export type CreateDownloadDocumentInput = DownloadDocumentInput;
export type UpdateDownloadDocumentInput = Partial<DownloadDocumentInput>;

export type DownloadDocumentsRepo = {
   list: () => Promise<DownloadDocumentRow[]>;
   create: (input: CreateDownloadDocumentInput) => Promise<{id: string}>;
   update: (id: string, patch: UpdateDownloadDocumentInput) => Promise<void>;
   remove: (id: string) => Promise<void>;
};

const LARAVEL_ORIGIN =
   process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
   'https://admin.petroleumstationbd.com';

function normalizeList(raw: any) {
   if (Array.isArray(raw)) return raw as DownloadableDocumentApiItem[];
   if (Array.isArray(raw?.data))
      return raw.data as DownloadableDocumentApiItem[];
   if (Array.isArray(raw?.data?.data))
      return raw.data.data as DownloadableDocumentApiItem[];
   return [];
}

function pickDate(value?: string | null) {
   if (!value) return '';
   const s = String(value);
   const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
   return match ? match[1] : s;
}

function resolveFileUrl(item: DownloadableDocumentApiItem) {
   const direct =
      item.document ??
      item.document_url ??
      item.file_path ??
      item.url ??
      item.file ??
      null;
   if (direct) return toAbsoluteUrl(LARAVEL_ORIGIN, direct);
   return '';
}

function normalizeStatus(value?: string | null): DownloadDocumentStatus {
   if (!value) return 'inactive';
   const normalized = value.toLowerCase();
   return normalized === 'active' ? 'active' : 'inactive';
}

function mapRow(
   item: DownloadableDocumentApiItem,
   idx: number,
): DownloadDocumentRow {
   console.log(item);
   return {
      id: String(item.id ?? idx + 1),
      sl: idx + 1,
      title: item.title ?? `Document ${idx + 1}`,
      publishDate: pickDate(item.publish_date),
      status: normalizeStatus(item.status),
      fileUrl: resolveFileUrl(item),
   };
}

let store: DownloadDocumentRow[] = structuredClone(MOCK_DOCUMENTS);

const mockDocumentsRepo: DownloadDocumentsRepo = {
   async list() {
      await mockDelay(250);
      return store
         .slice()
         .sort((a, b) => a.sl - b.sl)
         .map(r => ({...r}));
   },

   async create(input) {
      await mockDelay(350);

      const id = `doc_${Math.random().toString(16).slice(2)}_${Date.now()}`;
      const nextSl = store.length ? Math.max(...store.map(s => s.sl)) + 1 : 1;

      store = [
         ...store,
         {
            id,
            sl: nextSl,
            title: input.title,
            publishDate: input.publishDate,
            status: input.status ?? 'inactive',
            fileUrl: '#',
         },
      ];

      return {id};
   },

   async update(id, patch) {
      await mockDelay(300);
      store = store.map(r =>
         r.id === id
            ? {
                 ...r,
                 title: patch.title ?? r.title,
                 publishDate: patch.publishDate ?? r.publishDate,
                 status: patch.status ?? r.status,
              }
            : r,
      );
   },

   async remove(id) {
      await mockDelay(300);
      store = store
         .filter(r => r.id !== id)
         .map((r, idx) => ({...r, sl: idx + 1}));
   },
};

const apiDocumentsRepo: DownloadDocumentsRepo = {
   async list() {
      const res = await fetch('/api/downloadable-documents', {
         method: 'GET',
         cache: 'no-store',
         headers: {Accept: 'application/json'},
      });

      const raw = await res.json().catch(() => null);
      if (!res.ok)
         throw new Error(
            raw?.message ?? 'Failed to load downloadable documents',
         );

      return normalizeList(raw).map(mapRow);
   },

   async create(input) {
      const fd = new FormData();
      fd.append('title', input.title);
      fd.append('publish_date', input.publishDate);
      if (input.status) fd.append('status', input.status);
      if (input.file) fd.append('document', input.file);

      const res = await fetch('/api/downloadable-documents', {
         method: 'POST',
         body: fd,
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok)
         throw new Error(
            raw?.message ?? 'Failed to create downloadable document',
         );

      return {id: String(raw?.id ?? raw?.data?.id ?? '')};
   },

   async update(id, patch) {
      const fd = new FormData();
      if (patch.title) fd.append('title', patch.title);
      if (patch.publishDate) fd.append('publish_date', patch.publishDate);
      if (patch.status) fd.append('status', patch.status);
      if (patch.file) fd.append('document', patch.file);

      const res = await fetch(`/api/downloadable-documents/${id}`, {
         method: 'POST',
         body: fd,
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok)
         throw new Error(
            raw?.message ?? 'Failed to update downloadable document',
         );
   },

   async remove(id) {
      const res = await fetch(`/api/downloadable-documents/${id}`, {
         method: 'DELETE',
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok)
         throw new Error(
            raw?.message ?? 'Failed to delete downloadable document',
         );
   },
};

export const downloadDocumentsRepo: DownloadDocumentsRepo =
   env.dataMode === 'mock' ? mockDocumentsRepo : apiDocumentsRepo;
