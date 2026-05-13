import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('fintech_db');

        // Example: Read URL query params for filtering
        const { searchParams } = new URL(request.url);
        const industry = searchParams.get('industry');

        const query = industry ? { industry } : {};

        const deals = await db
            .collection('deals')
            .find(query)
            .limit(50)
            .toArray();

        return NextResponse.json({ data: deals, total: deals.length });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
    }
}
