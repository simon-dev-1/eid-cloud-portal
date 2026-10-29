import { useCallback, useEffect, useState } from 'react';
import * as filesService from '../services/files.service';

import type { FileDto } from '../services/files.service';

export const useFileList = () => {
  const [data, setData] = useState<FileDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await filesService.listFiles());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const files = await filesService.listFiles();
        if (active) {
          setData(files);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load files');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await filesService.deleteFile(id);
      setData((prev) => prev.filter((file) => file.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  }, []);

  return { data, isLoading, error, handlers: { refresh, remove } };
};
