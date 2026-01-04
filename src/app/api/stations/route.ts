import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => null);
}

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => null);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const qs = url.searchParams.toString();
    const path = qs ? `/gas-stations?${qs}` : '/gas-stations';

    const data = await laravelFetch<any>(path, { method: 'GET', auth: true });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to load stations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await readBody(req);
    if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

    const data = await laravelFetch<any>('/gas-stations', {
      method: 'POST',
      auth: true,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to create station' }, { status: 500 });
  }
}
