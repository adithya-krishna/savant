import { db } from '@/db';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { CreateNoteSchema } from '@/lib/validators/note';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const enrollment = await db.notes.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(enrollment);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = CreateNoteSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const enrollment = await db.notes.create({
      data: {
        id: nanoid(14),
        ...validation.data,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
