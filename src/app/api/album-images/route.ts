import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const albumId = searchParams.get('album_id');
    const path = albumId
      ? `/album-images?album_id=${encodeURIComponent(albumId)}`
      : '/album-images';

    const data = await laravelFetch(path, {
      method: 'GET',
      auth: false,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to load album images' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const data = await laravelFetch('/album-images', {
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
    return NextResponse.json({ message: 'Failed to upload album image' }, { status: 500 });
  }
}
