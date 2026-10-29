import { beforeEach, describe, expect, it } from 'vitest';
import {
  deleteFile,
  getFileDownloadUrl,
  listFiles,
  uploadFile,
} from '../../../src/services/files.service';
import { mockFetchResponse, mockGlobalFetch } from '../../test-utils';

const fileDto = {
  id: '00000000-0000-4000-8000-000000000001',
  originalName: 'hello.txt',
  contentType: 'text/plain',
  size: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('files.service', () => {
  beforeEach(() => {
    mockGlobalFetch.mockReset();
  });

  it('listFiles returns the parsed file list', async () => {
    mockGlobalFetch.mockResolvedValue(mockFetchResponse([fileDto]));

    await expect(listFiles()).resolves.toEqual([fileDto]);
    expect(mockGlobalFetch).toHaveBeenCalledWith('/api/v1/files', {
      method: 'GET',
      signal: undefined,
    });
  });

  it('uploadFile posts a multipart form with the file under the "file" field', async () => {
    mockGlobalFetch.mockResolvedValue(mockFetchResponse(fileDto, true, 201));
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    await expect(uploadFile(file)).resolves.toEqual(fileDto);

    const [url, init] = mockGlobalFetch.mock.calls[0];
    expect(url).toBe('/api/v1/files');
    expect(init.method).toBe('POST');
    expect(init.headers).toBeUndefined();

    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('file')).toBe(file);
  });

  it('deleteFile sends DELETE for the given id', async () => {
    mockGlobalFetch.mockResolvedValue(mockFetchResponse(null, true, 204));

    await expect(deleteFile(fileDto.id)).resolves.toBeUndefined();
    expect(mockGlobalFetch).toHaveBeenCalledWith(`/api/v1/files/${fileDto.id}`, {
      method: 'DELETE',
    });
  });

  it('getFileDownloadUrl builds the download URL', () => {
    expect(getFileDownloadUrl(fileDto.id)).toBe(`/api/v1/files/${fileDto.id}`);
  });
});
