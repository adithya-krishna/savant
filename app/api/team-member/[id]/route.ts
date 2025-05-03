import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { updateCounselorSchema } from "@/lib/validators/counselor";

function getIdFromReq(req: NextRequest) {
  const segments = new URL(req.url).pathname.split("/");
  return segments.pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = updateCounselorSchema.parse({ id, ...body });

  const counselor = await db.counselors.update({
    where: { id },
    data,
  });

  return NextResponse.json(counselor);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.counselors.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
