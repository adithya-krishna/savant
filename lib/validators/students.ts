import { z } from 'zod';
import { idSchema, nameSchema, decimalSchema } from './common';

const genderSchema = z.enum(['MALE', 'FEMALE', 'UNDISCLOSED']);

const studentBaseSchema = z.object({
  id: idSchema,

  first_name: nameSchema,

  last_name: z
    .string()
    .max(100, 'Last name must be 100 characters or less')
    .optional()
    .nullable(),

  parent_first_name: nameSchema,

  parent_last_name: z
    .string()
    .max(100, 'Parent last name must be 100 characters or less')
    .optional()
    .nullable(),

  parent_phone: z
    .string()
    .max(15, 'Parent phone must be 15 characters or less')
    .optional()
    .nullable(),

  address: z.string().optional().nullable(),

  gmaps_place_id: z
    .string()
    .max(255, 'Google Maps place ID must be 255 characters or less')
    .optional()
    .nullable(),

  gmaps_url: z
    .string()
    .max(1024, 'Google Maps URL must be 1024 characters or less')
    .url('Must be a valid URL')
    .optional()
    .nullable(),

  gmaps_latitude: decimalSchema.optional().nullable(),

  gmaps_longitude: decimalSchema.optional().nullable(),

  dob: z.coerce.date({
    required_error: 'Date of birth is required',
  }),

  gender: genderSchema,

  email: z
    .string()
    .email('Must be a valid email')
    .max(100, 'Email must be 100 characters or less')
    .optional()
    .nullable(),

  primary_contact: z
    .string({
      required_error: 'Primary contact is required',
    })
    .max(20, 'Primary contact must be 20 characters or less')
    .min(1, 'Primary contact is required'),

  secondary_contact: z
    .string()
    .max(20, 'Secondary contact must be 20 characters or less')
    .optional()
    .nullable(),

  intended_subject: z
    .string()
    .max(100, 'Intended subject must be 100 characters or less')
    .optional()
    .nullable(),

  learning_goal: z
    .string()
    .max(100, 'Learning goal must be 100 characters or less')
    .optional()
    .nullable(),

  lead_id: z
    .string()
    .max(20, 'Lead ID must be 20 characters or less')
    .optional()
    .nullable(),

  is_deleted: z.boolean().optional(),

  create_date: z.date().optional().default(new Date()),
  updated_date: z.date().optional().default(new Date()),
  deleted_at: z.date().optional().nullable(),
});

export const createStudentSchema = studentBaseSchema
  .extend({ gender: genderSchema.default('UNDISCLOSED') })
  .omit({
    id: true,
    create_date: true,
    updated_date: true,
  })
  .required({
    first_name: true,
    parent_first_name: true,
    dob: true,
    primary_contact: true,
  })
  .partial({
    last_name: true,
    parent_last_name: true,
    parent_phone: true,
    address: true,
    gmaps_place_id: true,
    gmaps_url: true,
    gmaps_latitude: true,
    gmaps_longitude: true,
    gender: true,
    email: true,
    secondary_contact: true,
    intended_subject: true,
    learning_goal: true,
    lead_id: true,
  });

export const updateStudentSchema = studentBaseSchema
  .omit({
    gmaps_place_id: true,
    gmaps_url: true,
    gmaps_latitude: true,
    gmaps_longitude: true,
  })
  .partial()
  .required({
    id: true,
  });

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
