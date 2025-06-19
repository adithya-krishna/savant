import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { updateTeamMemberSchema } from '@/lib/validators/team-member';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { getIdFromReq } from '@/lib/utils/api-utils';

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  try {
    const body = await request.json();
    const validation = updateTeamMemberSchema.safeParse({ id, ...body });

    if (!validation.success) {
      return validation.error;
    }

    const teamMember = await db.teamMember.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromReq(request);
    await db.teamMember.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAPIError(error);
  }
}
