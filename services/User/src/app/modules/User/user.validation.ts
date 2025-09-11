import { z } from 'zod';

// Role enum
export const RoleEnum = z.enum(['user', 'admin']);

// User schema
const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
});

export const UserValidation = {
  createUserSchema,
  updateUserSchema,
};
