import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { ArchiveController } from './archive.controller';

const router = Router();

router.get(
  '/get-my-all-archives',
  auth(Role.user),
  ArchiveController.getMyArchiveSchedulesWithQuery,
);
router.delete(
  '/delete-archive-and-restore-schedule/:id',
  auth(Role.user),
  ArchiveController.deleteArchiveFromDbAndRestoreTheSchedule,
);
router.delete(
  '/permanent-delete-archive/:id',
  auth(Role.user),
  ArchiveController.permanentArchiveDeleteFromDb,
);

export const ArchiveRoutes = router;
