import { Router } from 'express';
import { ScheduleRoutes } from '../modules/Schedule/schedule.route';
import { ArchiveRoutes } from '../modules/Archive/archive.route';
import { ReminderRoutes } from '../modules/Reminder/reminder.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/schedules',
    route: ScheduleRoutes,
  },
  {
    path: '/schedules/archives',
    route: ArchiveRoutes,
  },
  {
    path: '/schedules/reminders',
    route: ReminderRoutes,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;
