export const mockDelay = (ms = 450) =>
  new Promise<void>((res) => setTimeout(res, ms));
