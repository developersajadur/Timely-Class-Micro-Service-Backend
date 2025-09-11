import prisma from '../../shared/prisma';
import {
  generateOtp,
  hashOtp,
  compareOtp,
  sendOtpHandler,
} from './emailOtp.utils';
import { OTP_EXPIRY_MINUTES } from './emailOtp.constant';
import AppError from '../../helpers/AppError';
import status from 'http-status';

const sendEmailOtp = async (email: string) => {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.emailOtp.create({
    data: { email, otpHash, expiresAt },
  });

  await sendOtpHandler(email, otp);

  return { success: true, message: 'OTP sent to email' };
};

const verifyEmailOtp = async (email: string, otp: string) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.emailOtp.findFirst({
      where: { email, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new AppError(status.NOT_FOUND, 'OTP not found');
    } else if (record.verified) {
      throw new AppError(status.NOT_FOUND, ' already verified');
    }

    if (record.expiresAt < new Date()) {
      throw new AppError(status.NOT_ACCEPTABLE, 'OTP has expired');
    }

    const isValid = await compareOtp(otp, record.otpHash);
    if (!isValid) {
      throw new AppError(status.NOT_ACCEPTABLE, 'Invalid OTP');
    }

    await tx.emailOtp.update({
      where: { id: record.id },
      data: { verified: true, verifiedAt: new Date() },
    });

    await tx.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    return { success: true, message: 'Email verified successfully' };
  });
};

export const EmailOtpService = {
  sendEmailOtp,
  verifyEmailOtp,
};
