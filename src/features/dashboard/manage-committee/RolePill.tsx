import type { UserRole } from './types';

const roleUi: Record<UserRole, { label: string; cls: string }> = {
  MANAGER: {
    label: 'Manager',
    cls: 'bg-[#F6C34A] text-[#1B2A41]',
  },
  ADMIN: {
    label: 'Admin',
    cls: 'bg-[#0B2B3A] text-white',
  },
  AUTHOR: {
    label: 'Author',
    cls: 'bg-[#0B8F6B] text-white',
  },
};

export default function RolePill({ role }: { role: UserRole }) {
  const ui = roleUi[role];

  return (
    <span
      className={[
        'inline-flex h-[22px] items-center rounded-full px-4 text-[11px] font-semibold',
        ui.cls,
      ].join(' ')}
    >
      {ui.label}
    </span>
  );
}
