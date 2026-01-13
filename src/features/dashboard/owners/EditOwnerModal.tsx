'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import type { OwnerRow } from './types';

export default function EditOwnerModal({
  open,
  owner,
  busy,
  onClose,
  onSave,
}: {
  open: boolean;
  owner: OwnerRow | null;
  busy: boolean;
  onClose: () => void;
  onSave: (input: {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    profileImage: File | null;
  }) => void;
}) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !owner) return;
    setFullName(owner.ownerName ?? '');
    setPhoneNumber(owner.phone ?? '');
    setEmail(owner.email ?? '');
    setAddress(owner.address ?? '');
    setProfileImage(null);
    setPreviewUrl(null);
  }, [open, owner]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentPreview = useMemo(() => {
    if (previewUrl) return previewUrl;
    return owner?.photoUrl ?? '';
  }, [owner?.photoUrl, previewUrl]);

  return (
    <Modal open={open} title="Edit Owner" onClose={onClose} maxWidthClassName="max-w-[640px]">
      <div className="p-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Profile image</div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-[12px] border border-black/10 bg-[#F1F3F6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentPreview} alt="Owner profile" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setProfileImage(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : null);
                }}
                className="text-[12px] text-[#2B3A4A]"
              />
              <span className="text-[11px] text-[#6B7280]">
                {profileImage ? profileImage.name : 'Choose a new image to replace the current one.'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Full name</div>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Phone number</div>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Address</div>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-9 rounded-[8px] bg-[#F1F3F6] px-6 text-[12px] font-semibold text-[#2B3A4A] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave({ fullName, phoneNumber, email, address, profileImage })}
            disabled={busy}
            className="h-9 rounded-[8px] bg-[#009970] px-8 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
          >
            {busy ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
