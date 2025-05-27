import { Separator } from '@/components/ui/separator';

// interface StudentAccountProps {
//   params: Promise<{ id: string }>;
// }

export default async function LeadPage() {
  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Edit Student</h2>
      <p className="text-sm text-gray-400">
        Update student details, assign team members, and track changes to keep
        your pipeline accurate and current.
      </p>
      <Separator />
      <div className="flex h-full w-full md:h-auto">Account</div>
    </section>
  );
}
