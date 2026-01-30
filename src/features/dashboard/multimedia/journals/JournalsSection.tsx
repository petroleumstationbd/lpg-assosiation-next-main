'use client';

import {Plus} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';

import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import Modal from '@/components/ui/modal/Modal';
import {normalizeList} from '@/lib/http/normalize';
import {toAbsoluteUrl} from '@/lib/http/url';

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
  'https://admin.petroleumstationbd.com';

type JournalApiRow = {
  id?: number | string;
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
  title: string;
  type: 'video' | 'image' | 'document';
  description: string;
  publishDate: string;
  fileUrl: string;
  isActive: boolean;
};

type JournalRow = JournalItem & {sl: number};

function pickDate(value?: string | null) {
  if (!value) return '';
  const s = String(value);
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : s;
}

function resolveFileUrl(item: JournalApiRow) {
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

function normalizeActive(value?: boolean | number | string | null) {
  if (value === false) return false;
  if (value === true) return true;
  if (typeof value === 'string') return value !== '0';
  if (typeof value === 'number') return value !== 0;
  return true;
}

function mapRow(row: JournalApiRow): JournalItem | null {
  const id = Number(row.id);
  if (!Number.isFinite(id)) return null;

  return {
    id,
    title: row.title?.trim() || `Journal #${id}`,
    type: normalizeType(row.type),
    description: row.description ?? '',
    publishDate: pickDate(row.publish_date ?? row.created_at ?? row.updated_at),
    fileUrl: resolveFileUrl(row),
    isActive: normalizeActive(row.is_active),
  };
}

function typeLabel(type: JournalItem['type']) {
  if (type === 'video') return 'Video';
  if (type === 'image') return 'Image';
  return 'Document';
}

function fileAccept(type: JournalItem['type']) {
  if (type === 'image') return 'image/png,image/jpeg,image/webp';
  if (type === 'video') return 'video/*';
  return '.pdf,.doc,.docx,application/pdf';
}

function renderPreview(item: JournalItem) {
  if (!item.fileUrl) {
    return <p className="text-[12px] text-[#6F8093]">File is not available.</p>;
  }

  if (item.type === 'image') {
    return (
      <img
        src={item.fileUrl}
        alt={item.title}
        className="max-h-[360px] w-full rounded-[10px] object-contain"
      />
    );
  }

  if (item.type === 'video') {
    return (
      <video
        controls
        className="max-h-[360px] w-full rounded-[10px] bg-black"
      >
        <source src={item.fileUrl} />
      </video>
    );
  }

  return (
    <a
      href={item.fileUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex h-9 items-center justify-center rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white"
    >
      Open Document
    </a>
  );
}

export default function JournalsSection() {
  const [rows, setRows] = useState<JournalRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<JournalItem | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<JournalItem | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journals', {
        method: 'GET',
        cache: 'no-store',
        headers: {Accept: 'application/json'},
      });

      const raw = await res.json().catch(() => null);
      if (!res.ok) return;

      const list = normalizeList<JournalApiRow>(raw)
        .map(mapRow)
        .filter(Boolean) as JournalItem[];

      const mapped = list.map((item, idx) => ({...item, sl: idx + 1}));
      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: number) => {
    if (!Number.isFinite(id)) {
      window.alert('Invalid journal id');
      return;
    }

    const ok = window.confirm('Remove this journal?');
    if (!ok) return;

    const snapshot = rows;
    setRows((prev) => prev.filter((row) => row.id !== id));

    try {
      const res = await fetch(`/api/journals/${id}`, {
        method: 'DELETE',
        headers: {Accept: 'application/json'},
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setRows(snapshot);
        window.alert(data?.message ?? 'Failed to delete journal');
      }
    } catch {
      setRows(snapshot);
      window.alert('Network error. Please try again.');
    }
  };

  const columns = useMemo<ColumnDef<JournalRow>[]>(
    () => [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        headerClassName: 'w-[70px]',
        minWidth: 70,
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'title',
        header: 'Title',
        sortable: true,
        sortValue: (r) => r.title,
        csvHeader: 'Title',
        csvValue: (r) => r.title,
        minWidth: 320,
        cell: (r) => (
          <span className="text-[11px] font-medium text-[#2B69C7]">
            {r.title}
          </span>
        ),
      },
      {
        id: 'type',
        header: 'Type',
        sortable: true,
        sortValue: (r) => r.type,
        csvHeader: 'Type',
        csvValue: (r) => r.type,
        headerClassName: 'w-[140px]',
        minWidth: 140,
        cell: (r) => (
          <span className="rounded-full bg-[#E6EEF9] px-3 py-1 text-[10px] font-semibold uppercase text-[#12306B]">
            {typeLabel(r.type)}
          </span>
        ),
      },
      {
        id: 'publishDate',
        header: 'Publish Date',
        sortable: true,
        sortValue: (r) => r.publishDate,
        csvHeader: 'Publish Date',
        csvValue: (r) => r.publishDate,
        headerClassName: 'w-[160px]',
        minWidth: 160,
        cell: (r) => (
          <span className="text-[11px] text-[#2B3A4A]">{r.publishDate}</span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        sortValue: (r) => (r.isActive ? 1 : 0),
        csvHeader: 'Status',
        csvValue: (r) => (r.isActive ? 'Active' : 'Inactive'),
        headerClassName: 'w-[130px]',
        minWidth: 130,
        cell: (r) => (
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
              r.isActive
                ? 'bg-[#E5F7EB] text-[#1F7A3D]'
                : 'bg-[#FCE8E6] text-[#C0392B]'
            }`}
          >
            {r.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        id: 'view',
        header: 'View',
        sortable: false,
        csvHeader: 'View',
        csvValue: () => '',
        headerClassName: 'w-[120px]',
        minWidth: 120,
        cell: (r) => (
          <button
            type="button"
            onClick={() => {
              setViewItem(r);
              setViewOpen(true);
            }}
            className="inline-flex h-6 items-center justify-center rounded-[3px] bg-[#12306B] px-4 text-[10px] font-semibold text-white"
          >
            View
          </button>
        ),
      },
      {
        id: 'edit',
        header: 'Edit',
        sortable: false,
        csvHeader: 'Edit',
        csvValue: () => '',
        headerClassName: 'w-[120px]',
        minWidth: 120,
        cell: (r) => (
          <button
            type="button"
            onClick={() => {
              setEditItem(r);
              setEditOpen(true);
            }}
            className="inline-flex h-6 items-center justify-center rounded-[3px] bg-[#26B35B] px-4 text-[10px] font-semibold text-white"
          >
            Edit
          </button>
        ),
      },
      {
        id: 'delete',
        header: 'Delete',
        sortable: false,
        csvHeader: 'Delete',
        csvValue: () => '',
        headerClassName: 'w-[120px]',
        minWidth: 120,
        cell: (r) => (
          <button
            type="button"
            onClick={() => onDelete(r.id)}
            className="inline-flex h-6 items-center justify-center rounded-[3px] bg-[#FF5B5B] px-4 text-[10px] font-semibold text-white"
          >
            Delete
          </button>
        ),
      },
    ],
    [rows]
  );

  return (
    <section className="min-w-0">
      <h2 className="text-center text-[14px] font-semibold text-[#133374]">
        Overview of Journals
      </h2>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex h-8 items-center gap-2 rounded-[4px] bg-[#009970] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
        >
          <Plus size={14} />
          Add Journal
        </button>
      </div>

      <div className="mt-4">
        <TablePanel<JournalRow>
          rows={loading ? [] : rows}
          columns={columns}
          getRowKey={(r) => String(r.id)}
          searchText={(r) =>
            [r.title, r.type, r.publishDate].filter(Boolean).join(' ')
          }
          showExport={false}
          totalLabel={(n) => (
            <div className="text-[14px] font-semibold text-[#2D8A2D]">
              Total Journals : <span className="text-[#133374]">{n}</span>
            </div>
          )}
          cellWrapClassName="min-h-[58px] py-2 flex items-center"
        />
      </div>

      <JournalFormModal
        open={addOpen}
        mode="create"
        onClose={() => setAddOpen(false)}
        onSaved={async () => {
          setAddOpen(false);
          await load();
        }}
      />

      <JournalFormModal
        open={editOpen}
        mode="edit"
        initial={editItem}
        onClose={() => {
          setEditOpen(false);
          setEditItem(null);
        }}
        onSaved={async () => {
          setEditOpen(false);
          setEditItem(null);
          await load();
        }}
      />

      <JournalViewModal
        open={viewOpen}
        item={viewItem}
        onClose={() => {
          setViewOpen(false);
          setViewItem(null);
        }}
      />
    </section>
  );
}

function JournalViewModal({
  open,
  item,
  onClose,
}: {
  open: boolean;
  item: JournalItem | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={item?.title ?? 'View Journal'}
      onClose={onClose}
      maxWidthClassName="max-w-[920px]"
    >
      <div className="space-y-4 p-5 text-[13px] text-[#2B3A4A]">
        {item ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6F8093]">
              {item.publishDate ? (
                <span>Published Date: {item.publishDate}</span>
              ) : null}
              <span className="rounded-full bg-[#E6EEF9] px-3 py-1 text-[10px] font-semibold uppercase text-[#12306B]">
                {typeLabel(item.type)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
                  item.isActive
                    ? 'bg-[#E5F7EB] text-[#1F7A3D]'
                    : 'bg-[#FCE8E6] text-[#C0392B]'
                }`}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {item.description ? (
              <p className="text-[13px] text-[#2B3A4A]">{item.description}</p>
            ) : (
              <p className="text-[13px] text-[#2B3A4A]">
                Journal details are not available yet.
              </p>
            )}

            {renderPreview(item)}
          </div>
        ) : (
          <p className="text-[12px] text-[#6F8093]">No journal selected.</p>
        )}
      </div>
    </Modal>
  );
}

function JournalFormModal({
  open,
  mode,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: JournalItem | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<JournalItem['type']>('document');
  const [description, setDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setType(initial?.type ?? 'document');
    setDescription(initial?.description ?? '');
    setPublishDate(initial?.publishDate ?? '');
    setFile(null);
    setIsActive(initial?.isActive ?? true);
    setSaving(false);
    setError('');
  }, [initial, open]);

  const canSubmit = Boolean(title.trim() && publishDate.trim());

  const submit = async () => {
    setError('');

    if (!title.trim()) return setError('Title is required.');
    if (!publishDate.trim()) return setError('Publish date is required.');
    if (mode === 'create' && !file) return setError('File is required.');

    if (!initial && mode === 'edit') return setError('Missing journal data.');

    const fd = new FormData();
    fd.set('title', title.trim());
    fd.set('type', type);
    fd.set('publish_date', publishDate);
    fd.set('is_active', isActive ? '1' : '0');
    if (description.trim()) fd.set('description', description.trim());
    if (file) fd.set('file', file);

    setSaving(true);
    try {
      const endpoint =
        mode === 'create'
          ? '/api/journals'
          : `/api/journals/${initial?.id}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: fd,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? 'Failed to save journal');
        return;
      }

      await onSaved();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const titleText = mode === 'create' ? 'Add Journal' : 'Edit Journal';

  return (
    <Modal open={open} title={titleText} onClose={onClose} maxWidthClassName="max-w-[640px]">
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
              placeholder="Journal title"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(normalizeType(e.target.value))}
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              >
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
                Publish date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-[6px] border border-black/10 px-3 py-2 text-[12px] outline-none focus:border-black/20"
              placeholder="Short description"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              {mode === 'create' ? 'File' : 'File (optional)'}
            </label>
            <input
              type="file"
              accept={fileAccept(type)}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-[12px]"
            />
            {mode === 'edit' && initial?.fileUrl ? (
              <p className="mt-1 text-[11px] text-[#6F8093]">
                Current file: <a className="text-[#2B69C7]" href={initial.fileUrl} target="_blank" rel="noreferrer noopener">View</a>
              </p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-[12px] text-[#2B3A4A]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>

          {error ? <p className="text-[12px] font-medium text-red-600">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={saving || !canSubmit}
              className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
            >
              {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
