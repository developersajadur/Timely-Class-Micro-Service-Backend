import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { loginLimiter } from './auth.rate-limiter';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateRequest(AuthValidation.LoginSchema),
  AuthController.loginUser,
);

export const AuthRoutes = router;
