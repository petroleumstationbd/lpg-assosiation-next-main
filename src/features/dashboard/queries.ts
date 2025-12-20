import { useQuery } from '@tanstack/react-query';
import { dashboardRepo } from './repo';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardRepo.getStats(),
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['me', 'profile'],
    queryFn: () => dashboardRepo.getMyProfile(),
  });
}
