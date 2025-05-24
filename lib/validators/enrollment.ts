import { z } from 'zod';
import { idSchema } from './common';

const dateSchema = z.coerce.date();
const statusSchema = z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD']);

const EnrollmentBaseSchema = z.object({
  id: idSchema,
  amount_paid: z
    .number()
    .positive({ message: 'Amount paid must be a positive integer' }),
  start_date: dateSchema.refine(date => date > new Date(), {
    message: 'Start date must be in the future',
  }),
  preferred_start_time: dateSchema.optional(),
  preferred_end_time: dateSchema.optional(),
  preferred_days: z
    .array(z.number().int().min(0).max(6))
    .nonempty('At least one preferred day must be selected'),
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
    .max(10, { message: 'Plan code must be 10 characters or less' }),
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
  deleted_at: true,
})
  .required({
    amount_paid: true,
    start_date: true,
    slots_remaining: true,
    course_id: true,
    status: true,
    student_id: true,
    plan_code: true,
    preferred_days: true,
  })
  .partial({
    preferred_start_time: true,
    preferred_end_time: true,
  });

const EnrollmentUpdateSchema = EnrollmentBaseSchema.partial().required({
  id: true,
});

export type EnrollmentCreateInput = z.infer<typeof EnrollmentCreateSchema>;
export type EnrollmentUpdateInput = z.infer<typeof EnrollmentUpdateSchema>;

export { EnrollmentBaseSchema, EnrollmentCreateSchema, EnrollmentUpdateSchema };
