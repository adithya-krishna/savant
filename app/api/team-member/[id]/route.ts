import { NextResponse } from "next/server";
import { db } from "@/db";
import { updateCounselorSchema } from "@/lib/validators/counselor";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  const data = updateCounselorSchema.parse({ id, ...body });

  const counselor = await db.counselors.update({
    where: { id },
    data,
  });

  return NextResponse.json(counselor);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await db.counselors.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
