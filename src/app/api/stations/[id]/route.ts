import { NextResponse, type NextRequest } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => null);
}

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const data = await laravelFetch<any>(`/gas-stations/${id}`, {
      method: 'DELETE',
      auth: true,
    });

    return NextResponse.json(data ?? { ok: true });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to delete station' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const data = await laravelFetch<any>(`/gas-stations/${id}`, {
      method: 'GET',
      auth: true,
    });

    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to load station' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const body = await readBody(req);
    if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

    // Laravel-compatible update (POST + _method=PUT)
    const data = await laravelFetch<any>(`/gas-stations/${id}?_method=PUT`, {
      method: 'POST',
      auth: true,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to update station' }, { status: 500 });
  }
}
