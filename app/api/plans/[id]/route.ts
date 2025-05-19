import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { UpdatePlanSchema } from "@/lib/validators/plans";
import { getIdFromReq } from "@/lib/utils/api-utils";

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = UpdatePlanSchema.parse({ code: id, ...body });

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
