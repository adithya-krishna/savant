import { z } from "zod";

const idSchema = z.string().min(1, { message: "ID is required" }).max(20);
const dateSchema = z.coerce.date();
const statusSchema = z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"]);

const EnrollmentBaseSchema = z.object({
    id: idSchema,
    amount_paid: z.number().int().positive({ message: "Amount paid must be a positive integer" }),
    start_date: dateSchema,
    preferred_timings: z.string().max(50, { message: "Preferred timings must be 50 characters or less" }).optional(),
    preferred_days: z.string().max(50, { message: "Preferred days must be 50 characters or less" }).optional(),
    teacher_name: z.string().max(100, { message: "Teacher name must be 100 characters or less" }).optional(),
    classes_remaining: z.number().int().nonnegative({ message: "Classes remaining must be a non-negative integer" }),
    student_id: idSchema.optional(),
    plan_code: z.string().max(10, { message: "Plan code must be 10 characters or less" }).optional(),
    course_id: idSchema,
    status: statusSchema,
    is_deleted: z.boolean().optional(),
    deleted_at: dateSchema.optional(),
});

const EnrollmentCreateSchema = EnrollmentBaseSchema.extend({
    id: idSchema.optional(),
    start_date: dateSchema.refine((date) => date >= new Date(), {
        message: "Start date cannot be in the past",
    }),
    classes_remaining: z.number().int().nonnegative().optional(),
    status: statusSchema.optional(),
    create_date: dateSchema.optional(),
    updated_date: dateSchema.optional(),
    is_deleted: z.boolean().optional(),
});

const EnrollmentUpdateSchema = EnrollmentBaseSchema.partial().extend({
    id: idSchema.optional(),
    amount_paid: z.number().int().positive().optional(),
    start_date: dateSchema.optional(),
    course_id: idSchema.optional(),
}).refine((data) => {
    const { id, ...rest } = data;
    return Object.keys(rest).length > 0;
}, {
    message: "At least one field must be provided for update",
    path: ["__update_validation"],
});

export type EnrollmentCreateInput = z.infer<typeof EnrollmentCreateSchema>;
export type EnrollmentUpdateInput = z.infer<typeof EnrollmentUpdateSchema>;

export {
    EnrollmentBaseSchema,
    EnrollmentCreateSchema,
    EnrollmentUpdateSchema,
};