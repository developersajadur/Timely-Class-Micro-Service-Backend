import { Router } from 'express';
import { ReminderController } from './reminder.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/add-or-update-reminder',
  auth(Role.user),
  ReminderController.addOrUpdateReminder,
);

export const ReminderRoutes = router;
