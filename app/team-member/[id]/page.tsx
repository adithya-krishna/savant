import { db } from "@/db";
import { notFound } from "next/navigation";
import CounselorForm from "@/components/CounselorForm";

interface PageProps {
  params: { id: string };
}

export default async function TeamMemberPage({ params: { id } }: PageProps) {
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
