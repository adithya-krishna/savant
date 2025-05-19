import { db } from "@/db";
import { handleAPIError } from "@/lib/utils/api-error-handler";
import { getIdFromReq } from "@/lib/utils/api-utils";
import { updateStudentSchema } from "@/lib/validators/students";
import { NextRequest, NextResponse } from "next/server";

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
    return handleAPIError(error);
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
    return handleAPIError(error);
  }
}
