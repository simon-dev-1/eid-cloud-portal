import { useEffect } from 'react';

import { Link, useNavigate } from 'react-router';

import { FileList } from '../components/FileList';
import { UploadForm } from '../components/UploadForm';
import { useUnlock } from '../context/unlock-context';
import { useFileList } from '../hooks/useFileList';
import styles from './Vault.module.css';

const VaultContent = () => {
  const { displayName, lock } = useUnlock();
  const { data, isLoading, error, handlers } = useFileList();

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Vault</h1>
        <div className={styles.actions}>
          <span className={styles.welcome}>Welcome, {displayName}</span>
          <Link to="/" className={styles.homeLink}>
            ← Back home
          </Link>
          <button type="button" className={styles.lock} onClick={lock}>
            Lock
          </button>
        </div>
      </header>

      <UploadForm onUploaded={() => void handlers.refresh()} />

      <FileList files={data} isLoading={isLoading} error={error} onDelete={handlers.remove} />
    </>
  );
};

export const Vault = () => {
  const navigate = useNavigate();
  const { isUnlocked } = useUnlock();

  useEffect(() => {
    if (!isUnlocked) {
      navigate('/unlock');
    }
  }, [isUnlocked, navigate]);

  if (!isUnlocked) {
    return null;
  }

  return (
    <main className={styles.container}>
      <VaultContent />
    </main>
  );
};
