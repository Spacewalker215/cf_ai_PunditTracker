import { NextResponse } from 'next/server';
import { createPrediction } from '@/lib/db-access';

export const runtime = 'edge';

export async function POST(request: Request) {
    const body = await request.json();
    const prediction = {
        id: crypto.randomUUID(),
        outcome: 'Pending' as const,
        ...body
    };

    const success = await createPrediction(prediction);

    if (success) {
        return NextResponse.json({ success: true, prediction });
    } else {
        return NextResponse.json({ success: false, error: 'Failed to save prediction' }, { status: 500 });
    }
}

export async function GET() {
    const { getAllPendingPredictions } = await import('@/lib/db-access');
    const predictions = await getAllPendingPredictions();
    return NextResponse.json(predictions);
}

export async function PATCH(request: Request) {
    const { updatePredictionOutcome } = await import('@/lib/db-access');
    const body = await request.json();
    const { id, outcome } = body;

    if (!id || !outcome) {
        return NextResponse.json({ success: false, error: 'Missing id or outcome' }, { status: 400 });
    }

    const success = await updatePredictionOutcome(id, outcome);

    if (success) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false, error: 'Failed to update prediction' }, { status: 500 });
    }
}
