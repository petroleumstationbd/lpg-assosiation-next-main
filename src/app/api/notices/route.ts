import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function GET() {
  try {
    const data = await laravelFetch('/notices', { method: 'GET', auth: true });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to load notices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const data = await laravelFetch('/notices', {
      method: 'POST',
      auth: true,
      body: fd,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to create notice' }, { status: 500 });
  }
}
