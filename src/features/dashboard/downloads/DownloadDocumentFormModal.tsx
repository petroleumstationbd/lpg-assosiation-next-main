'use client';

import {useEffect, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import type {DownloadDocumentInput, DownloadDocumentRow} from './types';

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: DownloadDocumentRow | null;
  saving?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: DownloadDocumentInput) => void | Promise<void>;
};

export default function DownloadDocumentFormModal({
  open,
  mode,
  initial,
  saving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [file, setFile] = useState<File | null>(null);

  const titleText =
    mode === 'create' ? 'Add Downloadable Document' : 'Edit Downloadable Document';

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setPublishDate(initial?.publishDate ?? '');
    setStatus(initial?.status ?? 'active');
    setFile(null);
  }, [open, initial]);

  return (
    <Modal open={open} title={titleText} onClose={onClose} maxWidthClassName="max-w-[520px]">
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            title: title.trim(),
            publishDate,
            status,
            file,
          });
        }}
      >
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="Document title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Publish Date
          </label>
          <input
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">Document</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-[12px]"
            accept=".pdf,.png,.jpg,.jpeg"
            required={mode === 'create'}
          />
          {mode === 'edit' ? (
            <p className="text-[11px] text-[#64748B]">Leave empty to keep existing file.</p>
          ) : null}
        </div>

        {error ? <div className="text-[12px] text-red-600">{error}</div> : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[6px] border border-[#E5E7EB] px-4 text-[12px] font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
