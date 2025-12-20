import {
  LayoutDashboard,
  User,
  Receipt,
  Users,
  Fuel,
  Inbox,
  UsersRound,
  Image as ImageIcon,
  Bell,
  Download,
  Settings,
  LogOut,
} from 'lucide-react';

export type NavChild = { label: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ size?: number }>;
  children?: NavChild[];
};

export const DASH_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'profile', label: 'Edit Profile', href: '/edit-profile', icon: User },
  { key: 'invoice', label: 'Invoice', href: '/invoice', icon: Receipt },

  {
    key: 'owners',
    label: 'Manage Owners',
    icon: Users,
    children: [
      { label: 'Unverified Owner', href: '/manage-owners/unverified' },
      { label: 'Verified Owner', href: '/manage-owners/verified' },
      { label: 'Register new Owner', href: '/manage-owners/register' },
    ],
  },

  {
    key: 'stations',
    label: 'Manage Stations',
    icon: Fuel,
    children: [
      { label: 'Unverified Stations', href: '/manage-stations/unverified' },
      { label: 'Verified Stations', href: '/manage-stations/verified' },
    ],
  },

  { key: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox },
  { key: 'committee', label: 'Manage Committee', href: '/manage-committee', icon: UsersRound },
  { key: 'media', label: 'Multimedia', href: '/multimedia', icon: ImageIcon },
  { key: 'notices', label: 'Notices', href: '/notices', icon: Bell },
  { key: 'downloads', label: 'Downloads', href: '/downloads', icon: Download },
  { key: 'settings', label: 'Setting', href: '/settings', icon: Settings },
];

export const DASH_FOOTER: NavItem[] = [
  { key: 'logout', label: 'Logout', href: '/logout', icon: LogOut },
];
