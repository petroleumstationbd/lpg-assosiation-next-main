import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const data = await laravelFetch(`/payment-records/${id}`, {
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
    return NextResponse.json(
      { message: 'Failed to delete payment record' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const formData = await req.formData();

    const data = await laravelFetch(`/payment-records/${id}?_method=PUT`, {
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
    return NextResponse.json(
      { message: 'Failed to update payment record' },
      { status: 500 }
    );
  }
}
