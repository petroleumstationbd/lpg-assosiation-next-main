import { env } from '@/lib/env';
import { mockDelay } from '@/lib/mockDelay';
import { MOCK_PROFILE, MOCK_STATS } from './mock';
import type { DashboardStats, MyProfile } from './types';

export type DashboardRepo = {
  getStats: () => Promise<DashboardStats>;
  getMyProfile: () => Promise<MyProfile>;
};

const mockDashboardRepo: DashboardRepo = {
  async getStats() {
    await mockDelay(350);
    return structuredClone(MOCK_STATS);
  },
  async getMyProfile() {
    await mockDelay(350);
    return structuredClone(MOCK_PROFILE);
  },
};

// Later: wire with axios/fetch + auth token
const apiDashboardRepo: DashboardRepo = {
  async getStats() {
    throw new Error('API repo not implemented yet');
  },
  async getMyProfile() {
    throw new Error('API repo not implemented yet');
  },
};

export const dashboardRepo: DashboardRepo = env.dataMode === 'mock'
  ? mockDashboardRepo
  : apiDashboardRepo;
