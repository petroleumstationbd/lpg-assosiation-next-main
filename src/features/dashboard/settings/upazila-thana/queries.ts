'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { upazilaRepo } from './repo';

const QK = ['settings', 'upazilas'] as const;

export function useUpazilas() {
  return useQuery({
    queryKey: QK,
    queryFn: () => upazilaRepo.list(),
  });
}

export function useDeleteUpazila() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => upazilaRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK });
    },
  });
}

export function useCreateUpazila() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { districtId: number; name: string }) =>
      upazilaRepo.create({ districtId: input.districtId, name: input.name }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK });
    },
  });
}

export function useUpdateUpazila() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; districtId: number; name: string }) =>
      upazilaRepo.update(input.id, { districtId: input.districtId, name: input.name }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK });
    },
  });
}
