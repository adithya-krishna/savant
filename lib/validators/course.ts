import { z } from "zod";

const idSchema = z.string().min(1, { message: "ID is required" }).max(20);
const dateSchema = z.coerce.date();
const difficultySchema = z.enum(["FOUNDATION", "BEGINNER", "INTERMEDIATE", "ADVANCED"]);

const CourseBaseSchema = z.object({
    id: idSchema,
    name: z.string().min(1, { message: "Name is required" })
        .max(100, { message: "Name must be 100 characters or less" }),
    difficulty: difficultySchema.optional(),
    description: z.string().max(255, { message: "Description must be 255 characters or less" }).optional(),
    instrument_id: idSchema.optional(),
    teacher_id: idSchema.optional(),
    create_date: dateSchema.optional(),
    updated_date: dateSchema.optional(),
});

const CourseCreateSchema = CourseBaseSchema.extend({
    id: idSchema.optional(),
    difficulty: difficultySchema.default("FOUNDATION"),
    create_date: dateSchema.optional(),
    updated_date: dateSchema.optional(),
}).refine((data) => {
    return !((data.instrument_id && !data.teacher_id) || (!data.instrument_id && data.teacher_id));
}, {
    message: "Either provide both instrument_id and teacher_id, or neither",
    path: ["instrument_id"],
});

const CourseUpdateSchema = CourseBaseSchema.partial().extend({
    id: idSchema.optional(),
}).refine((data) => {
    const { id, ...rest } = data;
    return Object.keys(rest).length > 0;
}, {
    message: "At least one field must be provided for update",
    path: ["__update_validation"],
}).refine((data) => {
    if (data.instrument_id !== undefined || data.teacher_id !== undefined) {
        return (data.instrument_id && data.teacher_id) ||
            (!data.instrument_id && !data.teacher_id);
    }
    return true;
}, {
    message: "Either provide both instrument_id and teacher_id, or neither",
    path: ["instrument_id"],
});

export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>;

export {
    CourseBaseSchema,
    CourseCreateSchema,
    CourseUpdateSchema,
};
