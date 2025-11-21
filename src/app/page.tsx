import Link from "next/link";
import styles from "./page.module.css";
import { getAllPundits } from "@/lib/db-access";

export const runtime = 'edge';

export default async function Home() {
  const pundits = await getAllPundits();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Pundit<span className={styles.highlight}>Tracker</span>
        </h1>
        <p className={styles.subtitle}>
          Who&apos;s right? Who&apos;s wrong? We keep score.
        </p>

        <div className={styles.grid}>
          {pundits.map((pundit) => (
            <Link href={`/pundit/${pundit.id}`} key={pundit.id} className={styles.card}>
              <h2>{pundit.name}</h2>
              <p className={styles.category}>{pundit.category}</p>
              <div className={styles.stats}>
                <span className={styles.accuracy}>{pundit.stats.accuracy}% Accuracy</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2025 PunditTracker | <Link href="/admin">Admin</Link></p>
      </footer>
    </div>
  );
}
