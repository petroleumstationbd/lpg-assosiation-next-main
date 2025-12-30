'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {divisionRepo, type DivisionCreateInput, type DivisionUpdateInput} from './repo';

const QK = ['settings', 'division'] as const;

export function useDivisions() {
  return useQuery({
    queryKey: QK,
    queryFn: () => divisionRepo.list(),
  });
}

export function useDeleteDivision() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => divisionRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: QK});
    },
  });
}

export function useCreateDivision() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: DivisionCreateInput) => divisionRepo.create(input),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: QK});
    },
  });
}

export function useUpdateDivision() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: {id: string; patch: DivisionUpdateInput}) =>
      divisionRepo.update(args.id, args.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: QK});
    },
  });
}
