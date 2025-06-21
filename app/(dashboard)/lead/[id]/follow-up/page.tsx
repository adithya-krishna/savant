import { Separator } from '@/components/ui/separator';

interface FollowUpPageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowUpPage({ params }: FollowUpPageProps) {
  const { id } = await params;
  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Follow Up</h2>
      <Separator />

      {id}
    </section>
  );
}
