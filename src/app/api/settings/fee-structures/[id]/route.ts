import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

type Ctx = { params: { id: string } };

function getId(params: Ctx['params']) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) throw new LaravelHttpError(400, 'Invalid id');
  return id;
}

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => ({}));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const id = getId(params);
    const data = await laravelFetch(`/fee-structures/${id}`, { method: 'DELETE', auth: true });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to delete fee structure' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const id = getId(params);
    const body = await readBody(req);
    const data = await laravelFetch(`/fee-structures/${id}`, {
      method: 'PUT',
      auth: true,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to update fee structure' }, { status: 500 });
  }
}
