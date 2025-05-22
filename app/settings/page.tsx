import React, { cache } from 'react';
import { db } from '@/db';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DeleteItemButton } from '@/components/delete-item-button';
import StageForm from '@/components/stage-form';
import { Pencil, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const getStages = cache(async () => {
  const stage = await db.stage.findMany({ orderBy: { name: 'asc' } });

  return stage;
});

export default async function SettingsPage() {
  const stage = await getStages();

  return (
    <div className="p-4">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Stage Settings</h1>
            <StageForm id="new">
              <Button variant="outline" size="icon">
                <Plus />
              </Button>
            </StageForm>
          </CardTitle>
          <CardDescription>Add or Edit stages for leads</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stage.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="w-full">{s.name}</TableCell>
                  <TableCell className="space-x-2">
                    <StageForm initialData={s} id={s.id}>
                      <Button variant="outline" size="icon">
                        <Pencil />
                      </Button>
                    </StageForm>
                    <DeleteItemButton type="stage" variant="icon" id={s.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
