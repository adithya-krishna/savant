import { db } from '@/db';
import { cache } from 'react';
import NoteForm from '@/components/note-form';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { auth } from '@/auth';
import { User } from '@prisma/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getNotes = cache(async (id: string) => {
  return await db.notes.findMany({ where: { lead_id: id } });
});

export default async function NotesPage({ params }: PageProps) {
  const { id } = await params;
  const notes = await getNotes(id);
  const session = await auth();

  let user = null;
  if (session && session.user) {
    user = session.user as User;
  }

  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Notes</h2>
      <Separator />

      <ScrollArea className="h-64 mt-4">
        {notes.map(n => (
          <div key={n.id} className="w-max max-w-2xl grid">
            <div className="px-3.5 py-2 bg-accent rounded justify-start items-center gap-3 inline-flex">
              <h5 className="text-foreground text-sm font-normal leading-snug">
                {n.content}
              </h5>
            </div>
            <div className="justify-end items-center inline-flex mb-2.5">
              <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
                {format(n.created_at, 'p')}
              </h6>
            </div>
          </div>
        ))}
      </ScrollArea>
      {user && <NoteForm leadId={id} userId={user.id} />}
    </section>
  );
}
