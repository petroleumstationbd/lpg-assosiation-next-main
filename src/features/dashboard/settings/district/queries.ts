'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { districtRepo, type DistrictCreateInput, type DistrictUpdateInput } from './repo';

const QK = ['settings', 'districts'] as const;

export function useDistricts() {
  return useQuery({
    queryKey: QK,
    queryFn: () => districtRepo.list(),
  });
}

export function useDeleteDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => districtRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK });
    },
  });
}

export function useCreateDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DistrictCreateInput) => districtRepo.create(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK });
    },
  });
}

export function useUpdateDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; patch: DistrictUpdateInput }) =>
      districtRepo.update(args.id, args.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK });
    },
  });
}
