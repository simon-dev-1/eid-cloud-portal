import { vi } from 'vitest';

type FetchMock = ReturnType<typeof vi.fn>;

export const mockGlobalFetch = globalThis.fetch as unknown as FetchMock;

export function mockFetchResponse<T>(data: T, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

export function mockFetchError(message = 'Network error'): Promise<never> {
  return Promise.reject(new TypeError(message));
}
