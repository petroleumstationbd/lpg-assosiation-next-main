import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { noticesRepo } from './repo';
import type { CreateNoticeInput } from './types';

const KEY = ['dashboard', 'notices'];

export function useNoticesList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => noticesRepo.list(),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateNotice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNoticeInput) => noticesRepo.create(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteNotice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noticesRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
