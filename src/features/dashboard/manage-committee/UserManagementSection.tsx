'use client';

import {useMemo} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import RolePill from './RolePill';
import {MOCK_USERS} from './mockUsers';
import type {UserRow} from './types';

export default function UserManagementSection() {
  const columns = useMemo<ColumnDef<UserRow>[]>(() => [
    {
      id: 'mark',
      header: 'Mark',
      sortable: false,
      headerClassName: 'w-[90px]',
      cell: () => (
        <input
          type='checkbox'
          className='h-4 w-4 rounded border-black/20'
        />
      ),
    },
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      sortValue: r => r.name,
      minWidth: 420,
      cell: r => {
        const notLoggedIn = !r.lastLoginAt;

        return (
          <div className='flex items-center justify-between gap-4 pr-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 overflow-hidden rounded-full bg-black/5'>
                <img
                  src={r.avatarUrl}
                  alt={r.name}
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>

              <div>
                <div className='text-[14px] font-semibold text-[#75B551]'>
                  {r.name}
                </div>
                <div className='text-[12px] text-[#4B6B8A]'>{r.email}</div>
              </div>
            </div>

            {notLoggedIn && (
              <div className='text-[12px] font-medium text-[#E39B2D]'>
                Not Log in
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'roles',
      header: 'User Role',
      sortable: false,
      minWidth: 420,
      cell: r => (
        <div className='flex flex-wrap gap-3'>
          {r.roles.map(role => (
            <RolePill key={role} role={role} />
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      headerClassName: 'w-[290px]',
      cell: () => (
        <div className='flex items-center gap-10 text-[12px] text-[#9AA7B2]'>
          <button type='button' className='flex items-center gap-2 hover:text-[#5E6A74]'>
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white text-[12px]'>
              ⚙
            </span>
            Modify Roles
          </button>

          <button type='button' className='flex items-center gap-2 hover:text-[#5E6A74]'>
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white text-[12px]'>
              ×
            </span>
            Remove User
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <section className='px-10 pb-10'>
      <h1 className='pt-10 text-center text-[40px] font-medium tracking-wide text-[#223A59]'>
        User Management
      </h1>

      <div className='mt-10'>
        <TablePanel<UserRow>
          rows={MOCK_USERS}
          columns={columns}
          getRowKey={(r) => r.id}
          searchText={(r) => `${r.name} ${r.email} ${r.roles.join(' ')}`}
          showTopBar={false}
          showExport={false}
          cellWrapClassName='min-h-[78px] py-3 flex items-center'
          controlsRightSlot={
            <button
              type='button'
              className='h-8 rounded-[6px] bg-[#0B2A56] px-6 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95'>
              Add User
            </button>
          }
        />
      </div>
    </section>
  );
}
