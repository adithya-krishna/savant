import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { db } from '@/db';
import { Prisma } from '@prisma/client';

export class APIError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: error.errors,
      },
      { status: 400 },
    );
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          meta: error.meta,
        },
        { status: 404 },
      );
    }

    // make this a common function later
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          success: false,
          message: `Unable to create ${error.meta?.modelName || 'Entry'}`,
          meta: error.meta,
        },
        { status: 404 },
      );
    }
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 },
  );
};

export const checkUniqueName = async (name: string, id?: string) => {
  const existingInstrument = await db.instruments.findFirst({
    where: {
      name,
      ...(id && { NOT: { id } }), // Exclude current record for updates
    },
  });
  return !existingInstrument;
};
