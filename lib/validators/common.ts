import { z } from 'zod';

export const idSchema = z
  .string()
  .length(14, 'An ID of 14 characters is required');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'First name must be at least 2 characters long')
  .max(100, 'First name cannot be more than 100 characters');
