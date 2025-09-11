import z from 'zod';

const sendEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    otp: z
      .string()
      .length(4, { message: 'OTP must be 4 digits' })
      .regex(/^\d{4}$/, { message: 'OTP must contain only digits' }),
  }),
});

export const EmailOtpValidation = {
  sendEmailOtpSchema,
  verifyEmailOtpSchema,
};
