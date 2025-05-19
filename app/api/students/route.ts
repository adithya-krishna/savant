import { db } from "@/db";
import { handleAPIError } from "@/lib/utils/api-error-handler";
import { createStudentSchema } from "@/lib/validators/students";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const leads = await db.student.findMany({
    orderBy: { create_date: "desc" },
    // include: {
    //   lead: true,
    //   enrollments: true,
    // },
  });
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createStudentSchema.parse(body);
    const id = nanoid(14);

    const student = await db.student.create({
      data: { id, ...validatedData },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
