import { db } from "@/db";
import { createStudentSchema } from "@/lib/validators/students";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          errors: error.flatten().fieldErrors,
          message: "Validation failed",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
