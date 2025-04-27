import { NextResponse } from "next/server";
import { db } from "@/db";
import { createCounselorSchema } from "@/lib/validators/counselor";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const body = await request.json();
  const data = createCounselorSchema.parse(body);

  const id = nanoid(14);

  const counselor = await db.counselors.create({
    data: { id, ...data },
  });

  return NextResponse.json(counselor, { status: 201 });
}
