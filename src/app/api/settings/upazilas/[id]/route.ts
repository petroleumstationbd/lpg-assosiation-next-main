import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

type Params = Promise<Record<string, string>>;
type Ctx = { params: Params };

async function getId(params: Params) {
  const p = await params; // Next.js 15+/16 => params is Promise
  const raw = p.id ?? Object.values(p)[0];
  const id = Number(raw);
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
    const id = await getId(params);

    const data = await laravelFetch(`/upazilas/${id}`, {
      method: 'DELETE',
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
    return NextResponse.json({ message: 'Failed to delete upazila' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const id = await getId(params);
    const body = await readBody(req);

    const data = await laravelFetch(`/upazilas/${id}`, {
      method: 'PUT',
      auth: true,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to update upazila' }, { status: 500 });
  }
}

/** Optional: if you ever update with POST + _method=PUT */
export async function POST(req: Request, { params }: Ctx) {
  try {
    const id = await getId(params);
    const body = await readBody(req);

    if (body instanceof FormData) body.set('_method', 'PUT');
    else (body as any)._method = 'PUT';

    const data = await laravelFetch(`/upazilas/${id}`, {
      method: 'POST',
      auth: true,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to update upazila' }, { status: 500 });
  }
}
