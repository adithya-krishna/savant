import { NextResponse } from "next/server";
import { db } from "@/db";
import { nanoid } from "nanoid";
import { InstrumentCreateSchema } from "@/lib/validators/instruments";
import { handleAPIError, APIError, checkUniqueName } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const instruments = await db.instruments.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return NextResponse.json(instruments);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = InstrumentCreateSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const isUnique = await checkUniqueName(validation.data.name);
    if (!isUnique) {
      throw new APIError("Instrument name must be unique", 409);
    }

    const instrument = await db.instruments.create({
      data: {
        id: nanoid(14),
        name: validation.data.name,
        description: validation.data.description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(instrument, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}