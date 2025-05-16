import { NextResponse } from "next/server";
import { db } from "@/db";
import { createTeamMemberSchema } from "@/lib/validators/team-member";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const body = await request.json();
  const data = createTeamMemberSchema.parse(body);

  const id = nanoid(14);

  const teamMember = await db.teamMember.create({
    data: { id, ...data },
  });

  return NextResponse.json(teamMember, { status: 201 });
}

export async function GET() {
  const teamMember = await db.teamMember.findMany({
    orderBy: { first_name: "asc" },
  });
  return NextResponse.json(teamMember);
}
