import { z } from 'zod';
import { idSchema, priceSchema } from './common';

const dateSchema = z.coerce.date();
const statusSchema = z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD']);
const PreferredTimeSlotSchema = z
  .record(z.string(), z.array(z.string()))
  .refine(
    data => {
      return Object.keys(data).every(key => /^[0-6]$/.test(key));
    },
    {
      message: 'Keys must be day numbers between 0 and 6',
    },
  );

const EnrollmentBaseSchema = z.object({
  id: idSchema,
  amount_paid: priceSchema.optional(),
  start_date: dateSchema.refine(date => date > new Date(), {
    message: 'Start date must be in the future',
  }),
  preferred_time_slots: PreferredTimeSlotSchema,
  slots_remaining: z
    .number()
    .int()
    .nonnegative({
      message: 'Classes remaining must be a non-negative integer',
    })
    .default(0),
  student_id: idSchema,
  plan_code: z
    .string()
    .max(6, { message: 'Plan code must be 6 characters long' }),
  course_id: idSchema,
  status: statusSchema,
  create_date: dateSchema.default(new Date()),
  updated_date: dateSchema.default(new Date()),
  is_deleted: z.boolean().optional(),
  deleted_at: dateSchema.optional(),
});

const EnrollmentCreateSchema = EnrollmentBaseSchema.omit({
  id: true,
  create_date: true,
  updated_date: true,
  is_deleted: true,
  deleted_at: true,
  amount_paid: true,
})
  .partial({
    start_date: true,
    slots_remaining: true,
    preferred_time_slots: true,
  })
  .required({
    plan_code: true,
    course_id: true,
    status: true,
    student_id: true,
  });

const EnrollmentUpdateSchema = EnrollmentBaseSchema.partial().required({
  id: true,
});

export type EnrollmentCreateInput = z.infer<typeof EnrollmentCreateSchema>;
export type EnrollmentUpdateInput = z.infer<typeof EnrollmentUpdateSchema>;

export { EnrollmentBaseSchema, EnrollmentCreateSchema, EnrollmentUpdateSchema };
