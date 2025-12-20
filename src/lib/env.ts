export const env = {
  dataMode: (process.env.NEXT_PUBLIC_DATA_MODE ?? 'mock') as 'mock' | 'api',
};
