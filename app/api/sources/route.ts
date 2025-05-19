import { NextResponse } from 'next/server';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { CreateSourceSchema } from '@/lib/validators/sources';

export async function GET() {
  const instruments = await db.sources.findMany({
    orderBy: { source: 'asc' },
  });
  return NextResponse.json(instruments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = CreateSourceSchema.parse(body);

  const stage = await db.sources.create({
    data: { id: nanoid(14), ...data },
  });

  return NextResponse.json(stage, { status: 201 });
}
