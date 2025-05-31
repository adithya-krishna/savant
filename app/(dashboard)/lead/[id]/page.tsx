import Stat from '@/components/stat';
import TextWithIcon from '@/components/text-with-icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db';
import { getWorkingDaysCount, toHumanReadableDate } from '@/lib/utils';
import { format } from 'date-fns';
import { AtSign, History, MapPin, Piano, Repeat } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface LeadProfileProps {
  params: Promise<{ id: string }>;
}

const getLeads = cache(async (id: string) => {
  const lead = await db.leads.findUnique({
    where: { id },
    include: {
      instruments: { select: { id: true, name: true } },
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
  const lead = await getLeads(id);
  const { ageing, contactAttempts, nextFollowUp, humanReadableDate } = lead;

  return (
    <>
      <section className="mt-12 px-2">
        <h2 className="text-2xl font-semibold">Profile information</h2>
        <Separator />

        <div className="mt-6">
          <div className="grid grid-cols-2 text-sm/6 text-foreground space-y-6">
            <TextWithIcon icon={AtSign} label={'Email'} />
            <p className="truncate text-right">{lead?.email}</p>
            <TextWithIcon icon={MapPin} label={'Area'} />
            <p className="text-right">{lead?.area}</p>
            <TextWithIcon icon={MapPin} label={'Community'} />
            <p className="text-right">{lead?.community}</p>
            <TextWithIcon icon={Piano} label={'Instruments'} />
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
      <section className="flex flex-wrap gap-4 mt-12 px-2">
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
    </>
  );
};

export default LeadProfile;
