import { db } from "@/db";
import { updateStudentSchema } from "@/lib/validators/students";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

function handleResponseError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        errors: error.flatten().fieldErrors,
        message: "Validation failed",
      },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }
  }

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}

function getIdFromReq(req: NextRequest) {
  const segments = new URL(req.url).pathname.split("/");
  return segments.pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  try {
    const body = await request.json();
    const validatedData = updateStudentSchema.parse({
      id,
      ...body,
      deleted_at: body.deleted_at ? new Date(body.deleted_at) : undefined,
    });

    const lead = await db.student.update({
      where: { id },
      data: {
        ...validatedData,
        deleted_at: validatedData.deleted_at
          ? new Date(validatedData.deleted_at)
          : undefined,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    return handleResponseError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hardDelete") === "true";

    const input = updateStudentSchema.parse({
      id: params.id,
    });

    let result;
    if (hardDelete) {
      result = await db.student.delete({
        where: { id: input.id },
      });
    } else {
      result = await db.student.update({
        where: { id: input.id },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: hardDelete
        ? "Student permanently deleted"
        : "Student soft deleted successfully",
    });
  } catch (error) {
    return handleResponseError(error);
  }
}
