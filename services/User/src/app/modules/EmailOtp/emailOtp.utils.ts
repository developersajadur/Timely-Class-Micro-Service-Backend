import bcrypt from 'bcrypt';
import prisma from '../../shared/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';
import { sendEmail } from '../../utils/email';
import { otpEmailTemplate } from '../../../templates/otpEmailTemplate';
import config from '../../config';

export const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const hashOtp = async (otp: string): Promise<string> => {
  const SALT_ROUNDS = Number(config.password_salt_rounds);
  return await bcrypt.hash(otp, SALT_ROUNDS);
};

export const compareOtp = async (
  otp: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(otp, hash);
};

export const sendOtpHandler = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user || user.isDeleted || user.isBlocked) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  await sendEmail({
    to: email,
    subject: 'Your OTP Code For Timely Class',
    html: otpEmailTemplate(otp, user.name),
  });
};
