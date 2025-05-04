import { db } from "@/db";
import { notFound } from "next/navigation";
import StageForm from "@/components/stage-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StagePage({ params }: PageProps) {
  const { id } = await params;

  let initialData: { id: string; name: string } | null = null;
  if (id !== "new") {
    const stage = await db.stages.findUnique({ where: { id } });
    if (!stage) notFound();
    initialData = { id: stage.id, name: stage.name };
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {id === "new" ? "Add Stage" : "Edit Stage"}
      </h1>
      <StageForm initialData={initialData} id={id} />
    </div>
  );
}
