import { NextResponse, type NextRequest } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    // 1) Read gas station details to find station owner id
    const station = await laravelFetch<any>(`/gas-stations/${id}`, {
      method: 'GET',
      auth: true,
    });

  const ownerId =
    station?.station_owner_id ??
    station?.stationOwnerId ??
    station?.station_owner?.id ??
    station?.owner?.id ??
    null;

  // 2) Prefer verifying station-owner (doc-defined)
    if (ownerId) {
      await laravelFetch<any>(`/station-owners/${ownerId}/approve`, {
        method: 'POST',
        auth: true,
      });
    }

    // 3) Verify station itself (if backend uses station-level status)
    const data = await laravelFetch<any>(`/gas-stations/${id}?_method=PUT`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ verification_status: 'APPROVED', is_verified: true }),
    });

    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    return NextResponse.json({ message: 'Failed to verify station' }, { status: 500 });
  }
}
