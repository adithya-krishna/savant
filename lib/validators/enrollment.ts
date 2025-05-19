import { z } from "zod";
import { idSchema } from "./common";

const dateSchema = z.coerce.date();
const statusSchema = z.enum(["ACTIVE", "COMPLETED", "CANCELLED", "ON_HOLD"]);

const EnrollmentBaseSchema = z.object({
  id: idSchema,
  amount_paid: z
    .number()
    .positive({ message: "Amount paid must be a positive integer" }),
  start_date: dateSchema.refine((date) => date > new Date(), {
    message: "Start date must be in the future",
  }),
  preferred_timings: z
    .string()
    .max(50, { message: "Preferred timings must be 50 characters or less" })
    .optional(),
  preferred_days: z
    .string()
    .max(50, { message: "Preferred days must be 50 characters or less" })
    .optional(),
  teacher_name: z
    .string()
    .max(100, { message: "Teacher name must be 100 characters or less" })
    .optional(),
  classes_remaining: z.number().int().nonnegative({
    message: "Classes remaining must be a non-negative integer",
  }),
  student_id: idSchema.optional(),
  plan_code: z
    .string()
    .max(10, { message: "Plan code must be 10 characters or less" })
    .optional(),
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
    classes_remaining: true,
    course_id: true,
    status: true,
  })
  .partial({
    preferred_timings: true,
    preferred_days: true,
    teacher_name: true,
    student_id: true,
    plan_code: true,
  });

const EnrollmentUpdateSchema = EnrollmentBaseSchema.partial().required({
  id: true,
});

export type EnrollmentCreateInput = z.infer<typeof EnrollmentCreateSchema>;
export type EnrollmentUpdateInput = z.infer<typeof EnrollmentUpdateSchema>;

export { EnrollmentBaseSchema, EnrollmentCreateSchema, EnrollmentUpdateSchema };
