import { db } from "@/db";
import { notFound } from "next/navigation";
import CounselorForm from "@/components/counselor-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  let counselor = null;
  if (id !== "new") {
    counselor = await db.counselors.findUnique({ where: { id } });
    if (!counselor) notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {id === "new" ? "Add Team Member" : "Edit Team Member"}
      </h1>
      <CounselorForm initialData={counselor} id={id} />
    </div>
  );
}
