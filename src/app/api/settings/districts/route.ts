import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function GET(req: Request) {
  try {
    // passthrough query params (optional but useful: ?division_id=...)
    const url = new URL(req.url);
    const qs = url.search ? url.search : '';

    const data = await laravelFetch(`/districts${qs}`, {
      method: 'GET',
      auth: true,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to load districts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const data = await laravelFetch('/districts', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to create district' }, { status: 500 });
  }
}
