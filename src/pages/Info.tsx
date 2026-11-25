import styles from './Info.module.css';

type Caveat = {
  title: string;
  body: string;
};

const caveats: Caveat[] = [
  {
    title: 'Sandbox / proof-of-concept',
    body: 'This is a test deployment, not a production service. It uses the swiyu Sandbox Wallet and Beta-ID test credentials — not the production Swiss e-ID.',
  },
  {
    title: 'Hosting location',
    body: 'This instance is hosted in the EU (Hetzner Cloud), not in Switzerland. Swiss data residency will be added for the production release.',
  },
  {
    title: 'Identity → vault binding (temporary)',
    body: 'Your vault is currently bound to your given name + family name (case-insensitive). This is a proof-of-concept simplification: two people with the same name would unlock the same vault. It will be replaced with a stable, unique identifier before production.',
  },
  {
    title: 'Encryption is not yet end-to-end',
    body: 'Files are currently stored server-side in plaintext, protected only by your e-ID session. Client-side encryption — the core promise of the product — is planned but not implemented yet. Do not store sensitive documents.',
  },
  {
    title: 'Custodial keys',
    body: 'The server generates and holds your vault master key and releases it after e-ID verification. This custodial design will be revisited before production.',
  },
];

export const Info = () => (
  <main className={styles.container}>
    <h1 className={styles.title}>About this deployment</h1>
    <p className={styles.subtitle}>Important limitations and caveats to keep in mind.</p>
    <ul className={styles.list}>
      {caveats.map((caveat) => (
        <li key={caveat.title} className={styles.item}>
          <h2 className={styles.itemTitle}>{caveat.title}</h2>
          <p className={styles.itemBody}>{caveat.body}</p>
        </li>
      ))}
    </ul>
  </main>
);
