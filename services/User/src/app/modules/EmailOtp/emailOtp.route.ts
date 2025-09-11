import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EmailOtpValidation } from './emailOtp.validation';
import { EmailOtpController } from './emailOtp.controller';
import {
  sendEmailOtpLimiter,
  verifyEmailOtpLimiter,
} from './emailOtp.rate-limiter';

const router = Router();

router.post(
  '/send-otp',
  sendEmailOtpLimiter,
  validateRequest(EmailOtpValidation.sendEmailOtpSchema),
  EmailOtpController.sendEmailOtp,
);

router.post(
  '/verify-otp',
  verifyEmailOtpLimiter,
  validateRequest(EmailOtpValidation.verifyEmailOtpSchema),
  EmailOtpController.verifyEmailOtp,
);

export const EmailOtpRoutes = router;
