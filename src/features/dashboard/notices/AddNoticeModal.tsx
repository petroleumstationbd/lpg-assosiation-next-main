'use client';

import {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import {useCreateNotice} from './queries';

const fieldBase =
  'h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[12px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#16B55B33]';

type LaravelValidationErrors = Record<string, string[]>;

function getLaravelErrorMessage(err: unknown) {
  const anyErr = err as any;

  const message =
    typeof anyErr?.message === 'string' && anyErr.message
      ? anyErr.message
      : 'Failed to create notice.';

  const errors: LaravelValidationErrors | undefined = anyErr?.errors;

  if (!errors) return message;

  const firstKey = Object.keys(errors)[0];
  const firstMsg = firstKey ? errors[firstKey]?.[0] : '';
  return firstMsg ? `${message} (${firstMsg})` : message;
}

export default function AddNoticeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createM = useCreateNotice();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Keep this because your older doc had it. If backend ignores it, no harm.
  const [audience, setAudience] = useState('all');

  // Newer doc says publish_date is required (YYYY-MM-DD)
  const [publishDate, setPublishDate] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (!open) return;

    setTitle('');
    setContent('');
    setAudience('all');
    setPublishDate('');
    setAttachments([]);
  }, [open]);

  const fileError = useMemo(() => {
    const tooBig = attachments.find((f) => f.size > 10 * 1024 * 1024);
    return tooBig ? 'Each attachment must be under 10MB.' : '';
  }, [attachments]);

  const canSave = useMemo(() => {
    if (!title.trim()) return false;
    if (!content.trim()) return false;

    // Treat publish_date as required per latest buyer doc
    if (!publishDate.trim()) return false;

    if (fileError) return false;
    return true;
  }, [title, content, publishDate, fileError]);

  return (
    <Modal
      open={open}
      title="Add Notice"
      onClose={onClose}
      maxWidthClassName="max-w-[920px]"
    >
      <div className="p-5">
        <div className="grid gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#334155]">
              Title*
            </label>
            <input
              className={fieldBase}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Important System Update"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#334155]">
              Content*
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the notice content..."
              className={[
                'min-h-[140px] w-full resize-none rounded-[8px] border border-[#CBD5E1] bg-white px-3 py-2',
                'text-[12px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#16B55B33]',
              ].join(' ')}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold text-[#334155]">
                Audience (optional / legacy)
              </label>
              <input
                className={fieldBase}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="all"
              />
              <div className="mt-1 text-[10px] text-[#64748B]">
                Keep all if unsure. Backend may ignore this field depending on implementation.
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#334155]">
                Publish Date* (YYYY-MM-DD)
              </label>
              <input
                type="date"
                className={fieldBase}
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#334155]">
              Attachments (optional, max 10MB each)
            </label>
            <input
              className={fieldBase}
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={(e) =>
                setAttachments(Array.from(e.target.files ?? []))
              }
            />
            {fileError ? (
              <div className="mt-1 text-[10px] text-red-600">{fileError}</div>
            ) : null}
          </div>

          {createM.isError ? (
            <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
              {getLaravelErrorMessage(createM.error)}
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-[8px] border border-black/10 bg-white px-4 text-[12px] font-medium text-[#475569]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSave || createM.isPending}
              onClick={() => {
                createM.mutate(
                  {
                    title: title.trim(),
                    content: content.trim(),
                    audience: audience.trim(),
                    publishDate: publishDate.trim(), 
                    attachments,
                  },
                  {onSuccess: onClose}
                );
              }}
              className="h-9 rounded-[8px] bg-[#009970] px-5 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {createM.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
