import { useEffect } from 'react';

import { useNavigate } from 'react-router';

import { QrCode } from '../components/QrCode';
import { useUnlock } from '../context/unlock-context';
import { useEidUnlock } from '../hooks/useEidUnlock';
import styles from './Unlock.module.css';

export const Unlock = () => {
  const navigate = useNavigate();
  const { isUnlocked, unlock } = useUnlock();
  const { status, deeplink, result, error, handlers } = useEidUnlock();

  useEffect(() => {
    if (isUnlocked) {
      navigate('/vault');
    }
  }, [isUnlocked, navigate]);

  useEffect(() => {
    if (status === 'success' && result?.vaultId && result?.displayName && result?.masterKey) {
      unlock({
        vaultId: result.vaultId,
        displayName: result.displayName,
        masterKey: result.masterKey,
      });
      navigate('/vault');
    }
  }, [status, result, unlock, navigate]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Unlock your vault</h1>
      <p className={styles.subtitle}>Verify your identity with the Swiss e-ID to continue.</p>

      {status === 'idle' && (
        <button type="button" className={styles.cta} onClick={() => void handlers.start()}>
          Unlock with e-ID
        </button>
      )}

      {status === 'pending' && (
        <div className={styles.qrWrap}>
          {deeplink ? <QrCode value={deeplink} /> : <p className={styles.hint}>Preparing…</p>}
          <p className={styles.hint}>Scan the QR code with the swiyu Wallet and approve.</p>
          <p className={styles.hintMuted}>Waiting for verification…</p>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.errorWrap}>
          <p className={styles.error}>{error}</p>
          <button type="button" className={styles.cta} onClick={() => void handlers.reset()}>
            Try again
          </button>
        </div>
      )}
    </main>
  );
};
