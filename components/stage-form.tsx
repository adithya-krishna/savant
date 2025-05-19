'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateStageInput, createStageSchema } from '@/lib/validators/stage';
import { useRouter } from 'next/navigation';

interface StageFormProps {
  initialData?: { name: string } | null;
  id?: string;
  children: React.ReactNode;
  isNew?: boolean;
}

function StageForm({ initialData, id, children }: StageFormProps) {
  const router = useRouter();
  const isNew = id === 'new';

  const form = useForm<CreateStageInput>({
    resolver: zodResolver(createStageSchema),
    defaultValues: initialData ? { name: initialData.name } : { name: '' },
  });

  const onSubmit = async (values: CreateStageInput) => {
    const url = isNew ? '/api/stages' : `/api/stages/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? values : { id, ...values }),
    });

    if (res.ok) {
      form.reset();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      router.refresh();
    } else {
      console.error('Failed to save stage');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{isNew ? 'Create Stage' : 'Edit Stage'}</DialogTitle>
              <DialogDescription>
                {isNew
                  ? 'Add a new stage to your pipeline'
                  : 'Make changes to your stage here'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Stage Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. New, Contacted"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isNew ? 'Create Stage' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default StageForm;
