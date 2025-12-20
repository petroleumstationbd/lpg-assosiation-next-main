export type DashboardStats = {
  totalStations: number;
  activeUsers: number;
  totalOwners: number;
  totalNotices: number;
};

export type MyProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string | null;
};
