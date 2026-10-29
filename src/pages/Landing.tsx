import { Link } from 'react-router';
import styles from './Landing.module.css';

export const Landing = () => (
  <main className={styles.container}>
    <h1 className={styles.title}>eid-cloud</h1>
    <p className={styles.subtitle}>
      Your encrypted cloud vault. Client-side encryption is coming soon.
    </p>
    <Link to="/vault" className={styles.cta}>
      Open your vault
    </Link>
  </main>
);
