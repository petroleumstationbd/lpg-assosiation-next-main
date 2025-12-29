import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

async function getId(ctx: any) {
  const p = ctx?.params;
  const { id } = await p; // works for params object or params Promise
  return String(id);
}

export async function DELETE(_req: Request, ctx: any) {
  try {
    const id = await getId(ctx);

    await laravelFetch(`/notices/${id}`, {
      method: 'DELETE',
      auth: true,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to delete notice' }, { status: 500 });
  }
}
