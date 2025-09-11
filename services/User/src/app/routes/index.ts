import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { EmailOtpRoutes } from '../modules/EmailOtp/emailOtp.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/users/auth',
    route: AuthRoutes,
  },
  {
    path: '/users/emails-otp',
    route: EmailOtpRoutes,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;
