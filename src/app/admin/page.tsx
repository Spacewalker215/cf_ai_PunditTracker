"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";

interface Pundit {
    id: string;
    name: string;
    category: string;
}

interface Prediction {
    id: string;
    punditId: string;
    statement: string;
    date: string;
    outcome: string;
    confidence?: number;
    reasoning?: string;
}

export default function AdminPage() {
    const [pundits, setPundits] = useState<Pundit[]>([]);
    const [selectedPundit, setSelectedPundit] = useState("");
    const [statement, setStatement] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(new Date().toISOString().split("T")[0]);
    }, []);
    const [deadline, setDeadline] = useState("");
    const [confidence, setConfidence] = useState(50);
    const [message, setMessage] = useState("");
    const [pendingPredictions, setPendingPredictions] = useState<Prediction[]>([]);

    const fetchPendingPredictions = () => {
        fetch('/api/predictions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPendingPredictions(data);
                }
            })
            .catch(err => console.error("Failed to fetch predictions", err));
    };

    useEffect(() => {
        // Fetch pundits
        fetch('/api/pundits')
            .then(res => res.json())
            .then(data => {
                setPundits(data);
                if (data.length > 0) setSelectedPundit(data[0].id);
            })
            .catch(err => console.error("Failed to fetch pundits", err));

        fetchPendingPredictions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("Saving...");

        try {
            const res = await fetch('/api/predictions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    punditId: selectedPundit,
                    statement,
                    date,
                    deadline,
                    confidence,
                }),
            });

            if (res.ok) {
                setMessage("Prediction added successfully!");
                setStatement("");
                fetchPendingPredictions();
            } else {
                setMessage("Failed to add prediction.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error saving prediction.");
        }

        setTimeout(() => setMessage(""), 3000);
    };

    const handleGrade = async (id: string, outcome: 'Correct' | 'Incorrect') => {
        console.log(`Grading prediction ${id} as ${outcome}`);

        try {
            const res = await fetch('/api/predictions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, outcome }),
            });

            if (res.ok) {
                setPendingPredictions(prev => prev.filter(p => p.id !== id));
                setMessage(`Prediction marked as ${outcome}!`);
            } else {
                setMessage("Failed to update prediction.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error updating prediction.");
        }

        setTimeout(() => setMessage(""), 3000);
    };

    const handleAutoGrade = async (prediction: Prediction) => {
        setMessage("Asking AI...");
        try {
            const res = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statement: prediction.statement, date: prediction.date }),
            });
            const data = await res.json();

            if (data.outcome) {
                setMessage(`AI Suggests: ${data.outcome} (${data.confidence}% confidence). Reason: ${data.reasoning}`);
            } else {
                setMessage("AI could not determine the outcome.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error connecting to AI.");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href="/" className={styles.backLink}>
                    &larr; Back to Dashboard
                </Link>

                <h1 className={styles.title}>Admin Dashboard</h1>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Add New Prediction</h2>
                    <p className={styles.subtitle}>Track a new prediction from a pundit.</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="pundit">Pundit</label>
                            <select
                                id="pundit"
                                value={selectedPundit}
                                onChange={(e) => setSelectedPundit(e.target.value)}
                                className={styles.select}
                            >
                                {pundits.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="statement">Prediction Statement</label>
                            <textarea
                                id="statement"
                                value={statement}
                                onChange={(e) => setStatement(e.target.value)}
                                className={styles.textarea}
                                required
                                placeholder="e.g. The stock will go up..."
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="date">Date Made</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="deadline">Deadline (Optional)</label>
                                <input
                                    type="date"
                                    id="deadline"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confidence">Confidence ({confidence}%)</label>
                            <input
                                type="range"
                                id="confidence"
                                min="0"
                                max="100"
                                value={confidence}
                                onChange={(e) => setConfidence(Number(e.target.value))}
                                className={styles.range}
                            />
                        </div>

                        <button type="submit" className={styles.button}>
                            Add Prediction
                        </button>
                    </form>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Pending Predictions</h2>
                    <p className={styles.subtitle}>Grade predictions that have resolved.</p>

                    <div className={styles.pendingList}>
                        {pendingPredictions.length === 0 ? (
                            <p className={styles.emptyState}>No pending predictions to grade.</p>
                        ) : (
                            pendingPredictions.map(prediction => {
                                const pundit = pundits.find(p => p.id === prediction.punditId);
                                return (
                                    <div key={prediction.id} className={styles.pendingCard}>
                                        <div className={styles.pendingHeader}>
                                            <span className={styles.punditName}>{pundit?.name}</span>
                                            <span className={styles.date}>{prediction.date}</span>
                                        </div>
                                        <p className={styles.statement}>&quot;{prediction.statement}&quot;</p>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleAutoGrade(prediction)}
                                                className={`${styles.actionButton} ${styles.aiButton}`}
                                            >
                                                ✨ Check with AI
                                            </button>
                                            <button
                                                onClick={() => handleGrade(prediction.id, 'Correct')}
                                                className={`${styles.actionButton} ${styles.correctButton}`}
                                            >
                                                Mark Correct
                                            </button>
                                            <button
                                                onClick={() => handleGrade(prediction.id, 'Incorrect')}
                                                className={`${styles.actionButton} ${styles.incorrectButton}`}
                                            >
                                                Mark Incorrect
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
}
