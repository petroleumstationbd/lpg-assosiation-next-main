'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { committeeRepo, type CreateCommitteeInput, CommitteeUpdateInput  } from './repo';
import type { CommitteeRow } from './types';

export function useCommitteeMembers() {
  return useQuery({
    queryKey: ['committee', 'members'],
    queryFn: () => committeeRepo.list(),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCommitteeMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommitteeInput) => committeeRepo.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['committee', 'members'] });
    },
  });
}

export function useDeleteCommitteeMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => committeeRepo.remove(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['committee', 'members'] });

      const prev = qc.getQueryData<CommitteeRow[]>(['committee', 'members']) ?? [];
      qc.setQueryData<CommitteeRow[]>(
        ['committee', 'members'],
        prev.filter((m) => m.id !== Number(id))
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['committee', 'members'], ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['committee', 'members'] });
    },
  });
}
export function useUpdateCommitteeMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CommitteeUpdateInput) => committeeRepo.update(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['committee', 'members'] });
    },
  });
}