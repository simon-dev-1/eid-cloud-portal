import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFileList } from '../../../src/hooks/useFileList';
import * as filesService from '../../../src/services/files.service';

vi.mock('../../../src/services/files.service', () => ({
  listFiles: vi.fn(),
  deleteFile: vi.fn(),
}));

const listFilesMock = vi.mocked(filesService.listFiles);
const deleteFileMock = vi.mocked(filesService.deleteFile);

const fileDto = {
  id: '00000000-0000-4000-8000-000000000001',
  originalName: 'hello.txt',
  contentType: 'text/plain',
  size: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('useFileList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads files on mount', async () => {
    listFilesMock.mockResolvedValue([fileDto]);

    const { result } = renderHook(() => useFileList());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.data).toEqual([fileDto]));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('surfaces a load error', async () => {
    listFilesMock.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useFileList());

    await waitFor(() => expect(result.current.error).toBe('boom'));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('removes a file from the list after a successful delete', async () => {
    listFilesMock.mockResolvedValue([fileDto]);
    deleteFileMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useFileList());
    await waitFor(() => expect(result.current.data).toEqual([fileDto]));

    await act(async () => {
      await result.current.handlers.remove(fileDto.id);
    });

    expect(deleteFileMock).toHaveBeenCalledWith(fileDto.id);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('surfaces a delete error and keeps the file in the list', async () => {
    listFilesMock.mockResolvedValue([fileDto]);
    deleteFileMock.mockRejectedValue(new Error('delete failed'));

    const { result } = renderHook(() => useFileList());
    await waitFor(() => expect(result.current.data).toEqual([fileDto]));

    await act(async () => {
      await result.current.handlers.remove(fileDto.id);
    });

    expect(result.current.error).toBe('delete failed');
    expect(result.current.data).toEqual([fileDto]);
  });

  it('refreshes the list from the server', async () => {
    listFilesMock.mockResolvedValueOnce([]).mockResolvedValueOnce([fileDto]);

    const { result } = renderHook(() => useFileList());
    await waitFor(() => expect(result.current.data).toEqual([]));

    await act(async () => {
      await result.current.handlers.refresh();
    });

    expect(result.current.data).toEqual([fileDto]);
    expect(listFilesMock).toHaveBeenCalledTimes(2);
  });
});
