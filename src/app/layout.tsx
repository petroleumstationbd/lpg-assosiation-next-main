import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Providers from './providers';
import './globals.css';

import { AuthProvider, type AuthUser } from '@/features/auth/AuthProvider';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';
import { getToken, clearToken } from '@/lib/auth/cookies';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LPG Association',
  description: 'LPG Association Website',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const SHOW_DASHBOARD_TEST_LINK = process.env.NEXT_PUBLIC_SHOW_DASHBOARD_TEST_LINK === '1';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = await getToken();

  let user: AuthUser | null = null;

  if (token) {
    try {
      user = await laravelFetch<AuthUser>('/me', { method: 'GET', auth: true });
    } catch (e: any) {
      if (e instanceof LaravelHttpError && e.status === 401) {
        clearToken();
      }
      user = null;
    }
  }

  return (
    <html className="bg-red-600" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-500 w-full`}>

        <Providers>
          <AuthProvider initialUser={user}>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
