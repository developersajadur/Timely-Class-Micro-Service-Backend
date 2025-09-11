import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/create',
  validateRequest(UserValidation.createUserSchema),
  UserController.createUserIntoDb,
);

router.patch(
  '/update',
  auth(Role.user),
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUserInDb,
);

router.get('/:id', auth(), UserController.getUserById);

router.get(
  '/get-single-user-without-auth/:id',
  auth(),
  UserController.getUserByIdWithoutAuth,
);

export const UserRoutes = router;
