import { redirect } from 'next/navigation';
import { getToken, clearToken } from '@/lib/auth/cookies';
import { apiFetch } from '@/lib/http/apiFetch';
import { AuthProvider, type AuthUser } from '@/features/auth/AuthProvider';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = getToken();
  if (!token) redirect('/login');

  let user: AuthUser | null = null;

  try {
    user = await apiFetch<AuthUser>('/me', { auth: true });
  } catch (e: any) {
    if (e?.status === 401) {
      clearToken();
      redirect('/login');
    }
    throw e;
  }

  return (
    <AuthProvider initialUser={user}>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
