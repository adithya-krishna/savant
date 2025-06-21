import { differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { Instruments, Leads, Stage } from '@prisma/client';
import { AlertItem, AlertType } from '@/app/types/user';

const HIGH_BUDGET = 50000;
const UPCOMING_DAYS = 3;
const CONTACT_LIMIT = 5;
const STALE_AFTER_DAYS = 7;

export function computeAlerts(
  lead: Leads & { stage: Stage | null } & { instruments: Instruments[] | null },
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const today = new Date();

  const push = (type: AlertType, title: string, description?: string) =>
    alerts.push({ type, title, description });

  // ---------- INFO ----------
  if (lead.expected_budget > HIGH_BUDGET) {
    push(
      'info',
      'High Expected Budget',
      `Lead expects a budget of ₹${lead.expected_budget}. Consider prioritising this lead.`,
    );
  }

  if (
    lead.walkin_date &&
    isAfter(lead.walkin_date, today) &&
    isBefore(lead.walkin_date, addDays(today, UPCOMING_DAYS))
  ) {
    push(
      'info',
      'Walk-in Approaching',
      `Scheduled walk-in on ${lead.walkin_date.toLocaleDateString()}.`,
    );
  }

  if (
    lead.next_followup &&
    isAfter(lead.next_followup, today) &&
    isBefore(lead.next_followup, addDays(today, UPCOMING_DAYS)) &&
    (lead.number_of_contact_attempts ?? 0) < 2
  ) {
    push(
      'info',
      'Upcoming Follow-up',
      `Next follow-up on ${lead.next_followup.toLocaleDateString()} with fewer than 2 contact attempts.`,
    );
  }

  if (!lead.instruments?.length) {
    push(
      'info',
      'Instruments Not Selected',
      'Lead has not selected any instruments yet.',
    );
  }

  if (!lead.source_id) {
    push(
      'info',
      'Source Missing',
      'Acquisition source has not been specified for this lead.',
    );
  }

  // Additional info: demo not taken yet
  if (!lead.demo_taken) {
    push('info', 'Demo Pending', 'Lead has not taken a demo class yet.');
  }

  // ---------- DANGER ----------
  const lastContactDays =
    lead.last_contacted_date &&
    differenceInDays(today, new Date(lead.last_contacted_date));

  if (!lead.last_contacted_date || (lastContactDays ?? 0) > STALE_AFTER_DAYS) {
    push(
      'error',
      'Stale Lead',
      'No contact attempts have been logged in over a week.',
    );
  }

  if (
    lead.walkin_date &&
    isBefore(lead.walkin_date, addDays(today, UPCOMING_DAYS)) &&
    !lead.team_member_id
  ) {
    push(
      'error',
      'Walk-in Unassigned',
      'Walk-in is imminent but no team member is assigned.',
    );
  }

  if (
    (lead.number_of_contact_attempts ?? 0) > CONTACT_LIMIT &&
    !['COLD', 'NOT RESPONDING'].includes(lead.stage?.name.toUpperCase() ?? '')
  ) {
    push(
      'error',
      'High Contact Attempts',
      `More than ${CONTACT_LIMIT} contact attempts without status change.`,
    );
  }

  // Additional danger: zero budget
  if (lead.expected_budget === 0) {
    push('error', 'Zero Budget', 'Expected budget is set to ₹0.');
  }

  return alerts;
}
