import { config } from '../config';
import { apiClient } from './api.client';

export interface FileDto {
  id: string;
  originalName: string;
  contentType: string;
  size: number;
  createdAt: string;
}

export const listFiles = (signal?: AbortSignal): Promise<FileDto[]> =>
  apiClient.get<FileDto[]>('/api/v1/files', signal);

export const uploadFile = (file: File): Promise<FileDto> => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post<FileDto>('/api/v1/files', formData);
};

export const deleteFile = (id: string): Promise<void> =>
  apiClient.delete<void>(`/api/v1/files/${id}`);

export const getFileDownloadUrl = (id: string): string => `${config.apiBaseUrl}/api/v1/files/${id}`;
