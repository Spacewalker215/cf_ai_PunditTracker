export type Category = 'Sports' | 'Finance' | 'Tech';

export type PredictionOutcome = 'Pending' | 'Correct' | 'Incorrect';

export interface Prediction {
    id: string;
    punditId: string;
    statement: string;
    date: string; // ISO date string
    deadline: string; // When the prediction should be verified
    outcome: PredictionOutcome;
    confidence?: number; // 0-100
    notes?: string;
}

export interface Pundit {
    id: string;
    name: string;
    bio: string;
    image: string; // URL or placeholder
    category: Category;
    stats: {
        totalPredictions: number;
        correctPredictions: number;
        accuracy: number; // Percentage
    };
}

// Mock Data

export const pundits: Pundit[] = [
    {
        id: 'jim-cramer',
        name: 'Jim Cramer',
        bio: 'Host of Mad Money on CNBC. Known for high-energy stock picks.',
        image: 'https://placehold.co/400x400/png?text=JC',
        category: 'Finance',
        stats: {
            totalPredictions: 150,
            correctPredictions: 72,
            accuracy: 48,
        },
    },
    {
        id: 'stephen-a-smith',
        name: 'Stephen A. Smith',
        bio: 'Sports television personality, radio host, and journalist.',
        image: 'https://placehold.co/400x400/png?text=SAS',
        category: 'Sports',
        stats: {
            totalPredictions: 200,
            correctPredictions: 110,
            accuracy: 55,
        },
    },
    {
        id: 'mkbhd',
        name: 'Marques Brownlee',
        bio: 'Tech reviewer and internet personality.',
        image: 'https://placehold.co/400x400/png?text=MKBHD',
        category: 'Tech',
        stats: {
            totalPredictions: 45,
            correctPredictions: 40,
            accuracy: 88,
        },
    },
];

export const predictions: Prediction[] = [
    {
        id: 'p1',
        punditId: 'jim-cramer',
        statement: 'Buy Silicon Valley Bank, it is a buy.',
        date: '2023-02-08',
        deadline: '2023-03-10',
        outcome: 'Incorrect',
        confidence: 90,
    },
    {
        id: 'p2',
        punditId: 'stephen-a-smith',
        statement: 'The Knicks will make the Eastern Conference Finals.',
        date: '2023-10-15',
        deadline: '2024-05-01',
        outcome: 'Pending',
        confidence: 85,
    },
    {
        id: 'p3',
        punditId: 'mkbhd',
        statement: 'The iPhone 15 will switch to USB-C.',
        date: '2023-01-10',
        deadline: '2023-09-12',
        outcome: 'Correct',
        confidence: 99,
    },
];

export function getPundit(id: string): Pundit | undefined {
    return pundits.find((p) => p.id === id);
}

export function getPredictions(punditId: string): Prediction[] {
    return predictions.filter((p) => p.punditId === punditId);
}
