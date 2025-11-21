import { getPunditById, getPredictionsByPundit } from "@/lib/db-access";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export const runtime = 'edge';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PunditPage({ params }: PageProps) {
    const { id } = await params;
    const pundit = await getPunditById(id);

    if (!pundit) {
        notFound();
    }

    const predictions = await getPredictionsByPundit(id);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href="/" className={styles.backLink}>
                    &larr; Back to Dashboard
                </Link>

                <header className={styles.header}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar}>{pundit.name.charAt(0)}</div>
                        <div>
                            <h1 className={styles.name}>{pundit.name}</h1>
                            <p className={styles.category}>{pundit.category}</p>
                        </div>
                    </div>
                    <div className={styles.statsCard}>
                        <div className={styles.accuracyScore}>
                            {pundit.stats.accuracy}%
                        </div>
                        <div className={styles.accuracyLabel}>Accuracy Score</div>
                    </div>
                </header>

                <section className={styles.bioSection}>
                    <p className={styles.bio}>{pundit.bio}</p>
                </section>

                <section className={styles.predictionsSection}>
                    <h2 className={styles.sectionTitle}>Prediction History</h2>
                    <div className={styles.predictionsList}>
                        {predictions.map((prediction) => (
                            <div key={prediction.id} className={`${styles.predictionCard} ${styles[prediction.outcome.toLowerCase()]}`}>
                                <div className={styles.predictionHeader}>
                                    <span className={styles.date}>{prediction.date}</span>
                                    <span className={`${styles.outcomeBadge} ${styles[prediction.outcome.toLowerCase() + 'Badge']}`}>
                                        {prediction.outcome}
                                    </span>
                                </div>
                                <p className={styles.statement}>&quot;{prediction.statement}&quot;</p>
                                {prediction.confidence && (
                                    <div className={styles.confidence}>
                                        Confidence: {prediction.confidence}%
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
