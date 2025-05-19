import { NextResponse } from 'next/server';
import { db } from '@/db';
import { createTeamMemberSchema } from '@/lib/validators/team-member';
import { nanoid } from 'nanoid';
import { handleAPIError } from '@/lib/utils/api-error-handler';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createTeamMemberSchema.parse(body);

    const id = nanoid(14);

    const teamMember = await db.teamMember.create({
      data: { id, ...data },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function GET() {
  try {
    const teamMember = await db.teamMember.findMany({
      orderBy: { first_name: 'asc' },
    });
    return NextResponse.json(teamMember);
  } catch (error) {
    return handleAPIError(error);
  }
}
