import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { updateStageSchema } from "@/lib/validators/stage";

function getIdFromReq(req: NextRequest) {
  return new URL(req.url).pathname.split("/").pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = updateStageSchema.parse({ id, ...body });

  const stage = await db.stages.update({
    where: { id },
    data: { name: data.name },
  });

  return NextResponse.json(stage);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.stages.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
