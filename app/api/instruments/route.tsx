import { NextResponse } from "next/server";
import { db } from "@/db";
import { nanoid } from "nanoid";
import { CreateInstrumentSchema } from "@/lib/validators/instruments";

export async function GET() {
  const instruments = await db.instruments.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(instruments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = CreateInstrumentSchema.parse(body);

  const stage = await db.instruments.create({
    data: {
      id: nanoid(14),
      name: data.name,
      description: data.description,
    },
  });

  return NextResponse.json(stage, { status: 201 });
}
