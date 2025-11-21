import { NextResponse } from 'next/server';
import { getAllPundits } from '@/lib/db-access';

export const runtime = 'edge';

export async function GET() {
    const pundits = await getAllPundits();
    return NextResponse.json(pundits);
}
