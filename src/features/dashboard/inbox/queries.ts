'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_MESSAGES } from './mock';
import type { InboxMessage } from './types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useInboxMessages() {
  return useQuery({
    queryKey: ['inbox-messages'],
    queryFn: async (): Promise<InboxMessage[]> => {
      await delay(350);
      return MOCK_MESSAGES;
    },
  });
}

export function useTrashMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(250);
      return { ok: true, id };
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['inbox-messages'] });
      const prev = qc.getQueryData<InboxMessage[]>(['inbox-messages']) ?? [];
      qc.setQueryData<InboxMessage[]>(
        ['inbox-messages'],
        prev.filter((m) => m.id !== id)
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['inbox-messages'], ctx.prev);
    },
  });
}

export function useSendReply() {
  return useMutation({
    mutationFn: async (payload: { messageId: string; text: string }) => {
      await delay(450);

      // Mock: in real API, POST /inbox/reply
      return { ok: true, ...payload };
    },
  });
}

