import status from 'http-status';
import AppError from '../../helpers/AppError';
import prisma from '../../shared/prisma';

const addOrUpdateReminder = async (
  scheduleId: string,
  userId: string,
  reminderMinutes: number,
) => {
  const updatedSchedule = await prisma.$transaction(async (tx) => {
    const schedule = await tx.schedule.findFirst({
      where: { id: scheduleId, userId, isDeleted: false },
    });

    if (!schedule || schedule.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Schedule not found.');
    }

    const result = await tx.schedule.update({
      where: { id: scheduleId },
      data: { reminderMinutes, reminderSent: false, lastReminderSent: null },
    });

    return result;
  });

  return updatedSchedule;
};

export const ReminderService = {
  addOrUpdateReminder,
};
