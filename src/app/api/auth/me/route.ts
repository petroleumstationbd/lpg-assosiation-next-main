import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/apiFetch';
import { getToken } from '@/lib/auth/cookies';

export async function GET() {
  try {
    const token = getToken();
    if (!token) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

    const user = await apiFetch<any>('/me', { auth: true });
    return NextResponse.json(user);
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json(e?.data ?? { message: 'Server error' }, { status });
  }
}
