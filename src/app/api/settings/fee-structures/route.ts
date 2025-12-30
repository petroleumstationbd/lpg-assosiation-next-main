import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

const PATH = '/fee-structures';

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => ({}));
}

export async function GET() {
  try {
    const data = await laravelFetch(PATH, { method: 'GET', auth: true });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to load fee structures' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await readBody(req);
    const data = await laravelFetch(PATH, {
      method: 'POST',
      auth: true,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to create fee structure' }, { status: 500 });
  }
}
