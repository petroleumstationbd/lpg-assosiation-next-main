'use client';

import {useQuery} from '@tanstack/react-query';
import {stationProfileRepo} from './repo';

const KEY = ['stations', 'profile'] as const;

export function useStationDetails(id?: string) {
   return useQuery({
      queryKey: [...KEY, id],
      queryFn: () => stationProfileRepo.getDetails(id as string),
      enabled: Boolean(id),
   });
}
