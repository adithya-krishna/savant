import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";

interface LeadProfileProps {
  params: Promise<{ id: string }>;
}

const LeadProfile = async ({ params }: LeadProfileProps) => {
  const { id } = await params;
  const lead = await db.leads.findUnique({ where: { id } });

  return (
    <div className="p-4">
      <Card className="max-w-lg p-6">
        <pre className="text-sm">{JSON.stringify(lead, null, 2)}</pre>
      </Card>
    </div>
  );
};

export default LeadProfile;
