import { z } from 'zod';

const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;

const createScheduleSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subject: z.string().min(1, 'Subject is required'),
    instructor: z.string().min(1, 'Instructor is required'),
    day: z.string().min(1, 'Day is required'), // e.g., Monday
    startTime: z
      .string()
      .regex(timeRegex, 'Invalid time format, use HH:mm AM/PM'),
    endTime: z
      .string()
      .regex(timeRegex, 'Invalid time format, use HH:mm AM/PM'),
    date: z.string().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color hex')
      .optional(),
    description: z.string().optional(),
  }),
});

const updateScheduleSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subject: z.string().min(1, 'Subject is required').optional(),
    instructor: z.string().min(1, 'Instructor is required').optional(),
    day: z.string().min(1, 'Day is required').optional(), // e.g., Monday
    startTime: z
      .string()
      .regex(timeRegex, 'Invalid time format, use HH:mm AM/PM')
      .optional(),
    endTime: z
      .string()
      .regex(timeRegex, 'Invalid time format, use HH:mm AM/PM')
      .optional(),
    date: z.string().optional().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color hex')
      .optional()
      .optional(),
    description: z.string().optional(),
  }),
});

export const ScheduleValidation = {
  createScheduleSchema,
  updateScheduleSchema,
};
