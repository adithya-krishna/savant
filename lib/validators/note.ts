import { z } from 'zod';
import { idSchema } from './common';

const dateSchema = z.coerce.date();

const NoteBaseSchema = z.object({
  id: idSchema,

  content: z.string().trim().nonempty(),

  is_pinned: z.boolean().optional().default(false),

  author_id: z.string(),
  lead_id: idSchema,

  created_at: dateSchema.default(new Date()),
  updated_at: dateSchema.default(new Date()),
});

const CreateNoteSchema = NoteBaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})
  .required({ content: true, author_id: true, lead_id: true })
  .partial({ is_pinned: true });

const UpdateNoteSchema = NoteBaseSchema.partial().required({
  id: true,
  author_id: true,
  lead_id: true,
});

export type NoteCreateInput = z.infer<typeof CreateNoteSchema>;
export type NoteUpdateInput = z.infer<typeof UpdateNoteSchema>;

export { NoteBaseSchema, CreateNoteSchema, UpdateNoteSchema };
