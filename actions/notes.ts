'use server';

import { CreateNoteSchema, NoteCreateInput } from '@/lib/validators/note';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { omit } from '@/lib/utils';

export async function createNote(values: NoteCreateInput) {
  const validation = CreateNoteSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const note = await db.notes.create({
    data: {
      id: nanoid(14),
      ...omit(validation.data, ['author_id', 'lead_id']),
      author: {
        connect: { id: validation.data.author_id },
      },
      lead: {
        connect: { id: validation.data.lead_id },
      },
    },
  });

  return { success: 'Note created', note };
}
