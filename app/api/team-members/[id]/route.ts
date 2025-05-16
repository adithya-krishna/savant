import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { updateTeamMemberSchema } from "@/lib/validators/team-member";

function getIdFromReq(req: NextRequest) {
  const segments = new URL(req.url).pathname.split("/");
  return segments.pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  const body = await request.json();
  const data = updateTeamMemberSchema.parse({ id, ...body });

  const teamMember = await db.teamMember.update({
    where: { id },
    data,
  });

  return NextResponse.json(teamMember);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
