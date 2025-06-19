import { Enrollment, Event, Prisma } from '@prisma/client';

export type SectionTypes =
  | 'team-member'
  | 'lead'
  | 'course'
  | 'stage'
  | 'student'
  | 'enrollment';

export type TeamMemberType = Prisma.TeamMemberGetPayload<{
  select: { id: true; first_name: true; last_name: true };
}>;

export type TeamMembersWithCourseIdType = Prisma.TeamMemberGetPayload<{
  include: { courses: { select: { id: true } } };
}>;

export type InstrumentType = Prisma.InstrumentsGetPayload<{
  select: { id: true; name: true; description: true };
}>;

export type LeadsWithInstruments = Prisma.LeadsGetPayload<{
  include: { instruments: { select: { id: true; name: true } } };
}>;

export type LeadsWithAllInclusions = Prisma.LeadsGetPayload<{
  include: {
    stage: true;
    team_member: { select: { id: true; first_name: true; last_name: true } };
    instruments: { select: { id: true; name: true } };
  };
}>;

export type StudentsGetType = Prisma.StudentGetPayload<object>;

export type CourseType = Prisma.CourseGetPayload<{
  select: { id: true; name: true };
}>;

export type PlanType = Prisma.PlansGetPayload<{
  select: {
    code: true;
    price: true;
    total_slots: true;
    name: true;
    description: true;
  };
}>;

export type TimeSlotSelection = {
  [dayNumber: number]: string[];
};

export type SelectOptionType = { label: string; value: string };

export type EnrollmentsGetType = Prisma.EnrollmentGetPayload<{
  include: {
    student: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
      };
    };
  };
}>;

export type CoursesGetType = Prisma.CourseGetPayload<{
  include: {
    teachers: { select: { id: true; first_name: true; last_name: true } };
    instrument: { select: { id: true; name: true } };
  };
}>;

export type ModifiedEventType = Omit<
  Event,
  'start_date_time' | 'end_date_time'
> & { guests: Enrollment[] } & {
  start_date_time: string;
  end_date_time: string;
};
