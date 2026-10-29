import { useState } from 'react';
import { z } from 'zod';
import * as filesService from '../services/files.service';

import type { FileDto } from '../services/files.service';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, 'Please choose a non-empty file')
  .refine((file) => file.size <= MAX_UPLOAD_BYTES, 'File exceeds the 10 MB limit');

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<FileDto | null> => {
    const parsed = fileSchema.safeParse(file);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid file');
      return null;
    }

    setIsUploading(true);
    setError(null);
    try {
      return await filesService.uploadFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, handlers: { upload } };
};
