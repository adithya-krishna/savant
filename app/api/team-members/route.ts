import { NextResponse } from 'next/server';
import { db } from '@/db';
import { createTeamMemberSchema } from '@/lib/validators/team-member';
import { nanoid } from 'nanoid';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { connectManyIfDefined, omit } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createTeamMemberSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const id = nanoid(14);

    const teamMember = await db.teamMember.create({
      data: {
        id,
        ...omit(validation.data, ['courseIds']),
        ...connectManyIfDefined('courses', validation.data.courseIds),
      },
    });

    return NextResponse.json(teamMember);
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
