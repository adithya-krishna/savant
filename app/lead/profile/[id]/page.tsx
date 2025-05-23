import Stat from '@/components/stat';
import StudentFormDialog from '@/components/student-form-dialog';
import TextWithIcon from '@/components/text-with-icon';
import { AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/db';
import {
  getFullName,
  getInitials,
  getWorkingDaysCount,
  toHumanReadableDate,
} from '@/lib/utils';
import { Avatar } from '@radix-ui/react-avatar';
import { format } from 'date-fns';
import {
  AtSign,
  History,
  MapPin,
  Phone,
  Piano,
  Repeat,
  UserRoundPlus,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface LeadProfileProps {
  params: Promise<{ id: string }>;
}

export const getLeadsWithInstruments = cache(async (id: string) => {
  const lead = await db.leads.findUnique({
    where: { id },
    include: {
      stage: { select: { name: true, color: true } },
      instruments: { select: { id: true, name: true } },
      student: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          create_date: true,
        },
      },
    },
  });

  if (!lead) notFound();

  const daysDifference =
    lead.last_contacted_date &&
    getWorkingDaysCount(lead.create_date!, lead.last_contacted_date);
  const ageing = daysDifference && `in ${daysDifference} days`;
  const contactAttempts =
    lead.number_of_contact_attempts && String(lead.number_of_contact_attempts);

  const nextFollowUp =
    lead.next_followup && format(lead.next_followup, 'do MMM');
  const humanReadableDate =
    lead.next_followup && toHumanReadableDate(lead.next_followup);

  return { ...lead, ageing, contactAttempts, nextFollowUp, humanReadableDate };
});

const LeadProfile = async ({ params }: LeadProfileProps) => {
  const { id } = await params;
  const lead = await getLeadsWithInstruments(id);
  const { ageing, contactAttempts, nextFollowUp, humanReadableDate } = lead;
  let stageStyle;
  if (lead.stage?.color) {
    stageStyle = { borderColor: lead.stage.color, color: lead.stage.color };
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex w-full px-2 mb-6 justify-between">
        <div className="flex space-x-4">
          <Avatar className="shrink-0 size-16">
            <AvatarFallback>{getInitials(lead)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex flex-row items-center w-full">
              <h2 className="text-2xl font-semibold">{getFullName(lead)}</h2>
              <Badge
                style={stageStyle}
                variant={'outline'}
                className={`ml-4 max-h-fit`}
              >
                {lead.stage?.name}
              </Badge>
            </div>
            <TextWithIcon
              iconSize={12}
              icon={Phone}
              label={lead?.phone ?? '-'}
            />
          </div>
        </div>
        <StudentFormDialog id={id}>
          <Button size="icon">
            <UserRoundPlus />
          </Button>
        </StudentFormDialog>
      </div>
      <section className="mt-12 px-2">
        <h2 className="text-2xl font-semibold">Profile information</h2>
        <Separator />

        <div className="mt-6">
          <div className="grid grid-cols-2 leading-6 space-y-6">
            <TextWithIcon
              className="text-base text-card-foreground"
              icon={AtSign}
              label={'Email'}
            />
            <p className="truncate text-right">{lead?.email}</p>
            <TextWithIcon
              className="text-base text-card-foreground"
              icon={MapPin}
              label={'Address'}
            />
            <p className="text-right">{lead?.address}</p>
            <TextWithIcon
              className="text-base text-card-foreground"
              icon={Piano}
              label={'Instruments'}
            />
            <div className="flex flex-row-reverse flex-wrap gap-1">
              {lead?.instruments.map(instrument => (
                <Badge className="max-h-fit" key={instrument.id}>
                  {instrument.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-wrap gap-4 w-full mt-12 px-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 text-sm font-medium w-56">
            <CardTitle>Contact Attempts</CardTitle>
            <History size={14} />
          </CardHeader>
          <CardContent>
            <Stat title={contactAttempts} subtitle={ageing} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 text-sm font-medium w-56">
            <CardTitle>Next Follow up</CardTitle>
            <Repeat size={14} />
          </CardHeader>
          <CardContent>
            <Stat title={nextFollowUp} subtitle={humanReadableDate} />
          </CardContent>
        </Card>
      </section>
      <section className="mt-12 px-2">
        <h2 className="text-2xl font-semibold">Student profiles</h2>
        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lead.student.map(s => (
              <TableRow key={s.id}>
                <TableCell className="w-full">{getFullName(s)}</TableCell>
                <TableCell className="space-x-2">
                  {format(s.create_date, 'do MMM')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default LeadProfile;
