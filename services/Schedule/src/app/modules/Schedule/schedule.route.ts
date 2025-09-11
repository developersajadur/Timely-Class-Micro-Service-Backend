import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleValidation } from './schedule.validation';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/create',
  auth(Role.user),
  validateRequest(ScheduleValidation.createScheduleSchema),
  ScheduleController.createSchedule,
);
router.patch(
  '/update/:id',
  auth(Role.user),
  validateRequest(ScheduleValidation.updateScheduleSchema),
  ScheduleController.updateSchedule,
);
router.get(
  '/get-my-schedules',
  auth(Role.user),
  ScheduleController.getMySchedulesWithQuery,
);
router.get(
  '/get-my-schedules/:id',
  auth(Role.user),
  ScheduleController.getMySingleScheduleById,
);
router.delete('/archive', auth(Role.user), ScheduleController.archiveSchedules);
router.patch(
  '/update-priority',
  auth(Role.user),
  ScheduleController.updatePriority,
);

export const ScheduleRoutes = router;
