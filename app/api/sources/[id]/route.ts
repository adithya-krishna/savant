import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { UpdateSourceSchema } from "@/lib/validators/sources";
import { getIdFromReq } from "@/lib/utils/api-utils";

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = UpdateSourceSchema.parse({ id, ...body });

  const stage = await db.sources.update({
    where: { id },
    data: { source: data.source, description: data.description || undefined },
  });

  return NextResponse.json(stage);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.sources.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
