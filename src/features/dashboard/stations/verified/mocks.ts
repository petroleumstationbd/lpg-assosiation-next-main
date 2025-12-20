// src/features/stations/verified/mocks.ts
import type { VerifiedStationRow } from './types';

export const MOCK_VERIFIED_STATIONS: VerifiedStationRow[] = [
  {
    id: 'st_1',
    sl: 1,
    stationName: 'Farrell Inc',
    ownerNameLines: ['1: Mayer – Kulas', '2: jock young'],
    ownerPhone: '580.903.7093 x721',
    division: 'Nigeria',
    district: 'Lake Aubreyside',
    upazila: 'East Josephshire',
    docUrl: 'https://example.com/doc-1.pdf',
  },
  {
    id: 'st_2',
    sl: 2,
    stationName: 'Dibbert Group',
    ownerNameLines: ['Koss - Bednar'],
    ownerPhone: '406-946-4797 x97642',
    division: 'Nigeria',
    district: 'Vonland',
    upazila: 'Fort Nadia',
    docUrl: 'https://example.com/doc-2.pdf',
  },
  {
    id: 'st_3',
    sl: 3,
    stationName: 'Kihn Inc',
    ownerNameLines: ['Hane - Reynolds'],
    ownerPhone: '702-291-4803 x4066',
    division: 'Belgium',
    district: 'Eastvale',
    upazila: 'Vilesfort',
    docUrl: 'https://example.com/doc-3.pdf',
  },
];
