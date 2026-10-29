import { Link } from 'react-router';
import { FileList } from '../components/FileList';
import { UploadForm } from '../components/UploadForm';
import { useFileList } from '../hooks/useFileList';
import styles from './Vault.module.css';

export const Vault = () => {
  const { data, isLoading, error, handlers } = useFileList();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vault</h1>
        <Link to="/" className={styles.homeLink}>
          ← Back home
        </Link>
      </header>

      <UploadForm onUploaded={() => void handlers.refresh()} />

      <FileList files={data} isLoading={isLoading} error={error} onDelete={handlers.remove} />
    </main>
  );
};
