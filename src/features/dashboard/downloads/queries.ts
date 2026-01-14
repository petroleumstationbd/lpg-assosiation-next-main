import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {downloadDocumentsRepo} from './repo';
import type {
  CreateDownloadDocumentInput,
  UpdateDownloadDocumentInput,
} from './repo';

const keys = {
  all: ['download-documents'] as const,
};

export function useDownloadDocuments() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => downloadDocumentsRepo.list(),
  });
}

export function useCreateDownloadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDownloadDocumentInput) =>
      downloadDocumentsRepo.create(input),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}

export function useUpdateDownloadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {id: string; patch: UpdateDownloadDocumentInput}) =>
      downloadDocumentsRepo.update(args.id, args.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}

export function useDeleteDownloadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => downloadDocumentsRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}
