import { z } from 'zod';

export const idSchema = z
  .string()
  .length(14, 'An ID of 14 characters is required');
