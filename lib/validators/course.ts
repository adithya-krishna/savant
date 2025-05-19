import { z } from "zod";
import { idSchema } from "./common";

const dateSchema = z.coerce.date();
const difficultySchema = z.enum([
  "FOUNDATION",
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
]);

const CourseBaseSchema = z.object({
  id: idSchema,
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" }),
  difficulty: difficultySchema.optional(),
  description: z
    .string()
    .max(255, { message: "Description must be 255 characters or less" })
    .optional(),
  instrument_id: idSchema.optional(),
  teacher_id: idSchema.optional(),
  create_date: dateSchema.default(new Date()),
  updated_date: dateSchema.default(new Date()),
});

const CourseCreateSchema = CourseBaseSchema.omit({
  id: true,
  create_date: true,
  updated_date: true,
})
  .extend({
    difficulty: difficultySchema.default("FOUNDATION"),
  })
  .required({
    name: true,
  });

const CourseUpdateSchema = CourseBaseSchema.partial().required({ id: true });

export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>;

export { CourseBaseSchema, CourseCreateSchema, CourseUpdateSchema };
