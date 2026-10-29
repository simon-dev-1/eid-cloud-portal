import { getFileDownloadUrl } from '../services/files.service';
import styles from './FileList.module.css';

import type { FileDto } from '../services/files.service';

interface FileListProps {
  files: FileDto[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

export const FileList = ({ files, isLoading, error, onDelete }: FileListProps) => {
  if (isLoading) {
    return <p className={styles.message}>Loading…</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (files.length === 0) {
    return <p className={styles.message}>No files yet. Upload one above.</p>;
  }

  return (
    <ul className={styles.list}>
      {files.map((file) => (
        <li key={file.id} className={styles.item}>
          <a
            href={getFileDownloadUrl(file.id)}
            download={file.originalName}
            className={styles.name}
          >
            {file.originalName}
          </a>
          <span className={styles.meta}>{formatBytes(file.size)}</span>
          <button type="button" className={styles.delete} onClick={() => onDelete(file.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};
