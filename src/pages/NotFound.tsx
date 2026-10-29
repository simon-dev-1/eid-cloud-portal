import { Link } from 'react-router';
import styles from './NotFound.module.css';

export const NotFound = () => (
  <main className={styles.container}>
    <h1 className={styles.title}>Page not found</h1>
    <p className={styles.subtitle}>The page you requested does not exist.</p>
    <Link to="/" className={styles.link}>
      Back to home
    </Link>
  </main>
);
