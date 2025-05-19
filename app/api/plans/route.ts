import { NextResponse } from 'next/server';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { CreatePlanSchema } from '@/lib/validators/plans';

export async function GET() {
  const plans = await db.plans.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = CreatePlanSchema.parse(body);

  const stage = await db.plans.create({
    data: { code: nanoid(6), ...data },
  });

  return NextResponse.json(stage, { status: 201 });
}
