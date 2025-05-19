import { db } from "@/db";
import { handleAPIError } from "@/lib/utils/api-error-handler";
import { CourseCreateSchema } from "@/lib/validators/course";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const course = await db.course.findMany({
      orderBy: { create_date: "asc" },
    });
    return NextResponse.json(course);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = CourseCreateSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const course = await db.course.create({
      data: {
        id: nanoid(14),
        ...validation.data,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
