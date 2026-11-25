import { Link } from 'react-router';
import styles from './Landing.module.css';

export const Landing = () => (
  <main className={styles.container}>
    <h1 className={styles.title}>eid-cloud</h1>
    <p className={styles.subtitle}>
      Your encrypted cloud vault. Verify with your Swiss e-ID to unlock.
    </p>
    <Link to="/unlock" className={styles.cta}>
      Unlock your vault
    </Link>
    <Link to="/info" className={styles.infoLink}>
      About this deployment
    </Link>
  </main>
);
