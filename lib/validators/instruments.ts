import { z } from "zod";

// Helper schemas
const idSchema = z.string().min(1, { message: "ID is required" }).max(20);
const nameSchema = z.string()
    .min(2, { message: "Name is required" })
    .max(50, { message: "Name must be 50 characters or less" });

// Base schema
const InstrumentBaseSchema = z.object({
  id: idSchema,
  name: nameSchema,
  description: z.string()
      .max(255, { message: "Description must be 255 characters or less" })
      .optional(),
});

// Create schema
const InstrumentCreateSchema = InstrumentBaseSchema.extend({
  id: idSchema.optional(), // ID might be auto-generated
  name: nameSchema.refine(
      async (name) => {
        // In your application, you would check against the database
        // to ensure uniqueness. This is just a placeholder.
        return true;
      },
      { message: "Instrument name must be unique" }
  ),
});

// Update schema
const InstrumentUpdateSchema = InstrumentBaseSchema.partial().extend({
  id: idSchema, // Required for identification
  name: nameSchema
      .optional()
      .refine(
          async (name) => {
            if (!name) return true; // Name is optional in updates
            // In your application, you would check against the database
            // to ensure uniqueness (excluding current record).
            // This is just a placeholder.
            return true;
          },
          { message: "Instrument name must be unique" }
      ),
}).refine(
    (data) => {
      // Ensure at least one field is being updated
      const { id, ...rest } = data;
      return Object.keys(rest).length > 0;
    },
    {
      message: "At least one field must be provided for update",
      path: ["__update_validation"],
    }
);

export {
  InstrumentBaseSchema,
  InstrumentCreateSchema,
  InstrumentUpdateSchema,
};

export type CreateInstrumentInput = z.infer<typeof InstrumentCreateSchema>;
export type UpdateInstrumentInput = z.infer<typeof InstrumentUpdateSchema>;
