import {NextResponse} from 'next/server';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';

function extractId(req: Request, params?: Record<string, any>) {
  const fromParams = params?.id ?? Object.values(params ?? {})[0];
  const raw =
    typeof fromParams === 'string'
      ? fromParams
      : Array.isArray(fromParams)
        ? fromParams[0]
        : null;

  if (raw) return raw;

  const pathname = new URL(req.url).pathname;
  return pathname.split('/').filter(Boolean).pop() ?? '';
}

export async function GET(req: Request, ctx: {params?: Record<string, any>}) {
  try {
    const id = extractId(req, ctx.params);
    const data = await laravelFetch(`/public/journals/${encodeURIComponent(String(id))}`, {
      method: 'GET',
      auth: false,
    });
    return NextResponse.json(data, {status: 200});
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        {message: e.message, errors: e.errors ?? null},
        {status: e.status}
      );
    }
    return NextResponse.json({message: 'Failed to load journal'}, {status: 500});
  }
}
