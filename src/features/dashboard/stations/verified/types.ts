// src/features/stations/verified/types.ts
export type VerifiedStationRow = {
  id: string;
  sl: number;

  stationName: string;
  ownerNameLines: string[];
  ownerPhone: string;

  division: string;
  district: string;
  upazila: string;

  docUrl?: string | null;
};
