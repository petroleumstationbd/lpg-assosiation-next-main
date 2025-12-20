// src/features/stations/verified/repo.ts
import { env } from '@/lib/env';
import { mockDelay } from '@/lib/mockDelay';
import type { VerifiedStationRow } from './types';
import { MOCK_VERIFIED_STATIONS } from './mocks';

// If you already have a shared http client, swap this in:
// import { http } from '@/lib/http';

export async function getVerifiedStationsRepo(): Promise<VerifiedStationRow[]> {
  if (env.dataMode === 'mock') {
    await mockDelay(250);
    return MOCK_VERIFIED_STATIONS;
  }

  // Example API call (adjust endpoint/response shape)
  // return http.get<VerifiedStationRow[]>('/stations/verified');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stations/verified`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch verified stations');
  return res.json();
}
