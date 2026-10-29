import { beforeEach, describe, expect, it } from 'vitest';
import { ApiError, apiClient } from '../../../src/services/api.client';
import { mockFetchError, mockFetchResponse, mockGlobalFetch } from '../../test-utils';

describe('api.client', () => {
  beforeEach(() => {
    mockGlobalFetch.mockReset();
  });

  describe('get', () => {
    it('requests the path with GET and returns parsed JSON', async () => {
      mockGlobalFetch.mockResolvedValue(mockFetchResponse({ id: '1' }));

      const result = await apiClient.get<{ id: string }>('/api/v1/files');

      expect(result).toEqual({ id: '1' });
      expect(mockGlobalFetch).toHaveBeenCalledWith('/api/v1/files', {
        method: 'GET',
        signal: undefined,
      });
    });
  });

  describe('post', () => {
    it('serializes object bodies as JSON with a Content-Type header', async () => {
      mockGlobalFetch.mockResolvedValue(mockFetchResponse({ ok: true }));

      await apiClient.post('/api/v1/files', { name: 'a' });

      const [, init] = mockGlobalFetch.mock.calls[0];
      expect(init.method).toBe('POST');
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(init.body).toBe(JSON.stringify({ name: 'a' }));
    });

    it('passes FormData through without setting Content-Type', async () => {
      mockGlobalFetch.mockResolvedValue(mockFetchResponse({ ok: true }));

      const formData = new FormData();
      formData.append('file', new File(['hello'], 'hello.txt', { type: 'text/plain' }));

      await apiClient.post('/api/v1/files', formData);

      const [, init] = mockGlobalFetch.mock.calls[0];
      expect(init.body).toBe(formData);
      expect(init.headers).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('resolves undefined on a 204 response', async () => {
      mockGlobalFetch.mockResolvedValue(mockFetchResponse(null, true, 204));

      await expect(apiClient.delete('/api/v1/files/1')).resolves.toBeUndefined();
      expect(mockGlobalFetch).toHaveBeenCalledWith('/api/v1/files/1', { method: 'DELETE' });
    });
  });

  describe('error handling', () => {
    it('uses the message field from the error body', async () => {
      mockGlobalFetch.mockResolvedValue(mockFetchResponse({ message: 'Not found' }, false, 404));

      const error = await apiClient.get('/api/v1/files/1').catch((err: unknown) => err);

      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe('Not found');
      expect((error as ApiError).status).toBe(404);
    });

    it('uses the first errors[] message when present', async () => {
      mockGlobalFetch.mockResolvedValue(
        mockFetchResponse({ errors: [{ message: 'File is required' }] }, false, 400),
      );

      await expect(apiClient.get('/api/v1/files')).rejects.toThrow('File is required');
    });

    it('falls back to the error field', async () => {
      mockGlobalFetch.mockResolvedValue(mockFetchResponse({ error: 'Unauthorized' }, false, 401));

      await expect(apiClient.get('/api/v1/files')).rejects.toThrow('Unauthorized');
    });

    it('falls back to a status message for non-JSON bodies', async () => {
      mockGlobalFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      } as unknown as Response);

      await expect(apiClient.get('/api/v1/files')).rejects.toThrow(
        'Request failed with status 500',
      );
    });

    it('propagates network errors', async () => {
      mockGlobalFetch.mockImplementation(() => mockFetchError('Failed to fetch'));

      await expect(apiClient.get('/api/v1/files')).rejects.toThrow('Failed to fetch');
    });
  });
});
