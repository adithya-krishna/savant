import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { UpdatePlanSchema } from "@/lib/validators/plans";

function getIdFromReq(req: NextRequest) {
  return new URL(req.url).pathname.split("/").pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = UpdatePlanSchema.parse({ id, ...body });

  const stage = await db.plans.update({
    where: { code: id },
    data: { description: data.description || undefined, ...data },
  });

  return NextResponse.json(stage);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.plans.delete({ where: { code: id } });
  return NextResponse.json({ success: true });
}
