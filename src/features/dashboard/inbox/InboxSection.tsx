'use client';

import { useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import ReplyModal from './ReplyModal';
import { useInboxMessages, useSendReply, useTrashMessage } from './queries';
import type { InboxMessage } from './types';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

const BRAND_GREEN = '#009970';
const NAME_GREEN = '#75B551';
const TEXT_DARK = '#133374';
const TEXT_MUTED = '#7B8EA3';

function MessageIcon() {
  return (
    <div className="relative grid h-[64px] w-[64px] place-items-center rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 shadow-sm">
      <MessageCircle className="h-8 w-8 text-[#1F3B7A]" />
      <span className="absolute right-[8px] top-[8px] h-[12px] w-[12px] rounded-full bg-[#EF4444] ring-2 ring-white" />
    </div>
  );
}

function RowActions({
  onReply,
  onTrash,
  disabled,
}: {
  onReply: () => void;
  onTrash: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-1 flex items-center gap-2 text-[10px] text-[#6F8093]">
      <button
        type="button"
        onClick={onReply}
        disabled={disabled}
        className="hover:text-[#133374] disabled:opacity-60"
      >
        Reply
      </button>
      <span className="opacity-60">•</span>
      <button
        type="button"
        onClick={onTrash}
        disabled={disabled}
        className="hover:text-[#E11D48] disabled:opacity-60"
      >
        Trash
      </button>
    </div>
  );
}

function MessageRow({
  item,
  onReply,
  onTrash,
  disabled,
}: {
  item: InboxMessage;
  onReply: () => void;
  onTrash: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-9">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.avatarUrl}
          alt={item.name}
          className="mt-[2px] h-10 w-10 rounded-full object-cover shadow-sm"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold" style={{ color: NAME_GREEN }}>
              {item.name}
            </span>
            <span className="truncate text-[11px]" style={{ color: TEXT_MUTED }}>
              {item.message}
            </span>
          </div>

          <RowActions onReply={onReply} onTrash={onTrash} disabled={disabled} />
        </div>
      </div>

      <div className="shrink-0 pt-[3px] text-[10px] text-[#A0AFC5]">{item.timeLabel}</div>
    </div>
  );
}

export default function InboxSection() {
  const q = useInboxMessages();
  const trashM = useTrashMessage();
  const sendM = useSendReply();

  const [active, setActive] = useState<InboxMessage | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);

  // If your hook returns array directly, change this to:
  // const items = Array.isArray(q) ? q : [];
  const items = useMemo(() => (q?.data ?? []) as InboxMessage[], [q?.data]);

  const anyBusy = trashM.isPending || sendM.isPending;

  return (
    <section className="pb-10">
      <div className="mx-auto mt-10 flex max-w-[860px] flex-col items-center">
        <span>
          <svg
            width={68}
            height={68}
            viewBox="0 0 68 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect width={68} height={68} fill="url(#pattern0_288_13689)" />
            <defs>
              <pattern
                id="pattern0_288_13689"
                patternContentUnits="objectBoundingBox"
                width={1}
                height={1}
              >
                <use xlinkHref="#image0_288_13689" transform="scale(0.00195312)" />
              </pattern>
              <image
                id="image0_288_13689"
                width={512}
                height={512}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0K..." // keep your full base64 as-is
              />
            </defs>
          </svg>
        </span>

        <h2 className="mt-4 text-center text-[22px] font-semibold" style={{ color: TEXT_DARK }}>
          Message
        </h2>

        <div className="mt-8 w-full rounded-[12px] bg-[#FAFBFF] px-10 py-4">
          {/* Loading */}
          {q?.isLoading ? (
            <div className="py-10 text-center text-[12px]" style={{ color: TEXT_MUTED }}>
              Loading messages...
            </div>
          ) : null}

          {/* Empty */}
          {!q?.isLoading && items.length === 0 ? (
            <div className="py-12 text-center text-[12px]" style={{ color: TEXT_MUTED }}>
              No messages found.
            </div>
          ) : null}

          {/* List */}
          {items.map((m, idx) => (
            <div key={m.id} className={cx(idx !== 0 && 'border-t border-black/5')}>
              <MessageRow
                item={m}
                disabled={anyBusy}
                onReply={() => {
                  setActive(m);
                  setReplyOpen(true);
                }}
                onTrash={() => trashM.mutate(m.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <ReplyModal
        open={replyOpen}
        message={active}
        busy={sendM.isPending}
        onClose={() => setReplyOpen(false)}
        onSend={({ messageId, text }) => {
          sendM.mutate(
            { messageId, text },
            {
              onSuccess: () => {
                setReplyOpen(false);
              },
            }
          );
        }}
      />
    </section>
  );
}
