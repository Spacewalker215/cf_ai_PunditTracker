import { getDB } from "./db";
import { pundits as mockPundits, predictions as mockPredictions, Pundit, Prediction } from "./data";

export async function getAllPundits(): Promise<Pundit[]> {
    const db = await getDB();
    if (!db) return mockPundits;

    try {
        const { results } = await db.prepare("SELECT * FROM Pundits").all<Pundit>();
        // Parse JSON fields if any (none currently)
        // We need to calculate stats dynamically or store them. 
        // For simplicity, let's assume the DB has them or we compute them here.
        // The schema has stats columns.
        return results.map(p => ({
            ...p,
            stats: {
                totalPredictions: p.totalPredictions,
                correctPredictions: p.correctPredictions,
                accuracy: p.accuracy
            }
        }));
    } catch (e) {
        console.error("Failed to fetch pundits from D1:", e);
        return mockPundits;
    }
}

export async function getPunditById(id: string): Promise<Pundit | undefined> {
    const db = await getDB();
    if (!db) return mockPundits.find(p => p.id === id);

    try {
        const pundit = await db.prepare("SELECT * FROM Pundits WHERE id = ?").bind(id).first<Pundit>();
        if (!pundit) return undefined;
        return {
            ...pundit,
            stats: {
                totalPredictions: pundit.totalPredictions,
                correctPredictions: pundit.correctPredictions,
                accuracy: pundit.accuracy
            }
        };
    } catch (e) {
        return mockPundits.find(p => p.id === id);
    }
}

export async function getPredictionsByPundit(punditId: string): Promise<Prediction[]> {
    const db = await getDB();
    if (!db) return mockPredictions.filter(p => p.punditId === punditId);

    try {
        const { results } = await db.prepare("SELECT * FROM Predictions WHERE punditId = ?").bind(punditId).all<Prediction>();
        return results;
    } catch (e) {
        return mockPredictions.filter(p => p.punditId === punditId);
    }
}

export async function createPrediction(prediction: Prediction): Promise<boolean> {
    const db = await getDB();
    if (!db) {
        console.log("Mock create prediction:", prediction);
        return true;
    }

    try {
        await db.prepare(
            "INSERT INTO Predictions (id, punditId, statement, date, deadline, outcome, confidence) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
            prediction.id,
            prediction.punditId,
            prediction.statement,
            prediction.date,
            prediction.deadline,
            prediction.outcome,
            prediction.confidence
        ).run();
        return true;
    } catch (e) {
        console.error("Failed to create prediction:", e);
        return false;
    }
}

export async function getAllPendingPredictions(): Promise<Prediction[]> {
    const db = await getDB();
    if (!db) return mockPredictions.filter(p => p.outcome === 'Pending');

    try {
        const { results } = await db.prepare("SELECT * FROM Predictions WHERE outcome = 'Pending'").all<Prediction>();
        return results;
    } catch (e) {
        return mockPredictions.filter(p => p.outcome === 'Pending');
    }
}

export async function updatePredictionOutcome(id: string, outcome: string): Promise<boolean> {
    const db = await getDB();
    if (!db) {
        const pred = mockPredictions.find(p => p.id === id);
        if (pred) pred.outcome = outcome as any;
        return true;
    }

    try {
        await db.prepare("UPDATE Predictions SET outcome = ? WHERE id = ?").bind(outcome, id).run();
        return true;
    } catch (e) {
        console.error("Failed to update prediction:", e);
        return false;
    }
}
