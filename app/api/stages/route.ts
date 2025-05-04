// app/api/stages/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { createStageSchema } from "@/lib/validators/stage";
import { nanoid } from "nanoid";

export async function GET() {
  const stages = await db.stages.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(stages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = createStageSchema.parse(body);

  const stage = await db.stages.create({
    data: {
      id: nanoid(14),
      name: data.name,
    },
  });

  return NextResponse.json(stage, { status: 201 });
}
