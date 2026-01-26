import type { ChangePasswordInput, Profile, UpdateProfileInput } from './types';
import { normalizePhone } from '@/lib/phone';

export type ProfileRepo = {
  getMe: () => Promise<Profile>;
  uploadAvatar: (file: File) => Promise<{ avatarUrl: string }>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<Profile>;
};

const LARAVEL_ORIGIN =
  process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

function toAbsoluteUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${LARAVEL_ORIGIN}${p}`;
}

function pickString(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

function normalizePayload(raw: any) {
  if (raw?.data) return raw.data;
  return raw;
}

function mapProfile(raw: any): Profile {
  const data = normalizePayload(raw);

  const fullName = pickString(data?.full_name, data?.name, data?.fullName);
  const email = pickString(data?.email);
  const phone = pickString(data?.phone_number, data?.phone);
  const address = pickString(data?.address);
  const avatar = pickString(
    data?.avatar_url,
    data?.avatar,
    data?.profile_image,
    data?.profileImage,
    data?.image,
    data?.avatarUrl
  );

  return {
    fullName,
    email,
    phone,
    address,
    avatarUrl: avatar ? toAbsoluteUrl(avatar) : null,
  };
}

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? 'Request failed');
  return data;
}

const apiProfileRepo: ProfileRepo = {
  async getMe() {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    const raw = await readJsonOrThrow(res);
    return mapProfile(raw);
  },

  async uploadAvatar(file) {
    const fd = new FormData();
    fd.set('avatar', file);

    const res = await fetch('/api/upload-avatar', {
      method: 'POST',
      body: fd,
    });

    const raw = await readJsonOrThrow(res);
    const data = normalizePayload(raw);
    const avatar = pickString(
      data?.avatar_url,
      data?.avatar,
      data?.profile_image,
      data?.profileImage,
      data?.image,
      data?.avatarUrl
    );
    return { avatarUrl: toAbsoluteUrl(avatar) ?? '' };
  },

  async changePassword(input) {
    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        current_password: input.oldPassword,
        new_password: input.newPassword,
        new_password_confirmation: input.newPassword,
      }),
    });

    await readJsonOrThrow(res);
  },




  async updateProfile(input) {
    const normalizedPhone = normalizePhone(input.phone);
    const res = await fetch('/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        full_name: input.fullName,
        email: input.email,
        phone_number: normalizedPhone,
        address: input.address,
      }),
    });

    const raw = await readJsonOrThrow(res);
    const mapped = mapProfile(raw);

    return {
      fullName: mapped.fullName || input.fullName,
      email: mapped.email || input.email,
      phone: mapped.phone || input.phone,
      address: mapped.address || input.address,
      avatarUrl: mapped.avatarUrl,
    };
  },
};

export const profileRepo: ProfileRepo = apiProfileRepo;
