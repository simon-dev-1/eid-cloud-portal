import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFileUpload } from '../../../src/hooks/useFileUpload';
import * as filesService from '../../../src/services/files.service';

vi.mock('../../../src/services/files.service', () => ({
  uploadFile: vi.fn(),
}));

const uploadFileMock = vi.mocked(filesService.uploadFile);

const fileDto = {
  id: '00000000-0000-4000-8000-000000000001',
  originalName: 'hello.txt',
  contentType: 'text/plain',
  size: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads a valid file and returns its metadata', async () => {
    uploadFileMock.mockResolvedValue(fileDto);
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const { result } = renderHook(() => useFileUpload());

    let uploaded;
    await act(async () => {
      uploaded = await result.current.handlers.upload(file);
    });

    expect(uploaded).toEqual(fileDto);
    expect(uploadFileMock).toHaveBeenCalledWith(file);
    expect(result.current.error).toBeNull();
    expect(result.current.isUploading).toBe(false);
  });

  it('rejects an empty file without calling the service', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' });

    const { result } = renderHook(() => useFileUpload());

    let uploaded;
    await act(async () => {
      uploaded = await result.current.handlers.upload(file);
    });

    expect(uploaded).toBeNull();
    expect(result.current.error).toBe('Please choose a non-empty file');
    expect(uploadFileMock).not.toHaveBeenCalled();
  });

  it('surfaces a service error and returns null', async () => {
    uploadFileMock.mockRejectedValue(new Error('Upload failed'));
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const { result } = renderHook(() => useFileUpload());

    let uploaded;
    await act(async () => {
      uploaded = await result.current.handlers.upload(file);
    });

    expect(uploaded).toBeNull();
    expect(result.current.error).toBe('Upload failed');
  });
});
