import { db } from "@/db";
import { notFound } from "next/navigation";
import TeamMemberForm from "@/components/team-member-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  let teamMember = null;
  if (id !== "new") {
    teamMember = await db.teamMember.findUnique({ where: { id } });
    if (!teamMember) notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {id === "new" ? "Add Team Member" : "Edit Team Member"}
      </h1>
      <TeamMemberForm initialData={teamMember} id={id} />
    </div>
  );
}
