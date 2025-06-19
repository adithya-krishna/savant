'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CreateNoteSchema, NoteCreateInput } from '@/lib/validators/note';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createNote } from '@/actions/notes';

export default function NoteForm({
  leadId,
  userId,
}: {
  leadId: string;
  userId: string;
}) {
  const router = useRouter();
  const form = useForm<NoteCreateInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      content: '',
      lead_id: leadId,
      author_id: userId,
      is_pinned: false,
    },
  });

  const onSubmit = async (values: NoteCreateInput) => {
    const res = await createNote(values);

    if (res.success) {
      form.reset();
      router.refresh();
    } else {
      console.error('Failed to add note');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...form.register('lead_id')} value={leadId} />
        <input type="hidden" {...form.register('author_id')} value={userId} />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>

              <FormDescription>
                Use &quot;@&quot; to Tag team members.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
