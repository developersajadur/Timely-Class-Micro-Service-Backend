import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { EmailOtpService } from './emailOtp.service';

const sendEmailOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await EmailOtpService.sendEmailOtp(email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'OTP sent to email Successfully',
    data: null,
  });
});

const verifyEmailOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await EmailOtpService.verifyEmailOtp(email, otp);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Email verified successfully',
    data: null,
  });
});

export const EmailOtpController = {
  sendEmailOtp,
  verifyEmailOtp,
};
