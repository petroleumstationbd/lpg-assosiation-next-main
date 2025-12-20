export type UserRole = 'Manager' | 'Admin' | 'Author';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  roles: UserRole[];
  lastLoginAt?: string | null; // null => Not Log in
};
