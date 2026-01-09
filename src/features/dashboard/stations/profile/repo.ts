async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? res.statusText ?? 'Request failed');
  return data;
}

export const stationProfileRepo = {
  async getDetails(id: string) {
    const res = await fetch(`/api/stations/${id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    return readJsonOrThrow(res);
  },
};
