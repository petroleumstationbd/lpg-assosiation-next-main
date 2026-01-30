'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPaymentRecord,
  deletePaymentRecord,
  listPaymentRecords,
  listUnverifiedStations,
  updatePaymentRecord,
} from './repo';
import type { PaymentRecordInput, PaymentRecordUpdateInput } from './types';

const KEY_PAYMENTS = ['payment-records'] as const;
const KEY_STATIONS = ['stations', 'unverified', 'options'] as const;

export function usePaymentRecords() {
  return useQuery({
    queryKey: KEY_PAYMENTS,
    queryFn: listPaymentRecords,
  });
}

export function useUnverifiedStationOptions(enabled = true) {
  return useQuery({
    queryKey: KEY_STATIONS,
    queryFn: listUnverifiedStations,
    enabled,
  });
}

export function useCreatePaymentRecord() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentRecordInput) => createPaymentRecord(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY_PAYMENTS });
    },
  });
}

export function useDeletePaymentRecord() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePaymentRecord(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY_PAYMENTS });
    },
  });
}

export function useUpdatePaymentRecord() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PaymentRecordUpdateInput }) =>
      updatePaymentRecord(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY_PAYMENTS });
    },
  });
}
