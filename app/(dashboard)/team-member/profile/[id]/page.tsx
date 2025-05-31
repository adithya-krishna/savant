import { Card } from '@/components/ui/card';
import { db } from '@/db';

interface TeamMemberProfileProps {
  params: Promise<{ id: string }>;
}

const TeamMemberProfile = async ({ params }: TeamMemberProfileProps) => {
  const { id } = await params;
  const lead = await db.teamMember.findUnique({ where: { id } });

  return (
    <div className="p-4">
      <Card className="max-w-lg p-6">
        <pre className="text-sm">{JSON.stringify(lead, null, 2)}</pre>
      </Card>
    </div>
  );
};

export default TeamMemberProfile;
