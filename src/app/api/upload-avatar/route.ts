import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const data = await laravelFetch('/upload-avatar', {
      method: 'POST',
      auth: true,
      body: formData,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to upload avatar' }, { status: 500 });
  }
}
