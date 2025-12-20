// src/features/stations/verified/queries.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getVerifiedStationsRepo } from './repo';

export function useVerifiedStations() {
  return useQuery({
    queryKey: ['stations', 'verified'],
    queryFn: getVerifiedStationsRepo,
  });
}
