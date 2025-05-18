import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { UpdateInstrumentSchema } from "@/lib/validators/instruments";

function getIdFromReq(req: NextRequest) {
  return new URL(req.url).pathname.split("/").pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = UpdateInstrumentSchema.parse({ id, ...body });

  const stage = await db.instruments.update({
    where: { id },
    data: { name: data.name, description: data.description || undefined },
  });

  return NextResponse.json(stage);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.instruments.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
