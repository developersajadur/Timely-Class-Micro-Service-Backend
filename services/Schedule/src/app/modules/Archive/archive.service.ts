/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { PrismaQueryBuilder } from '../../builders/PrismaQueryBuilder';
import AppError from '../../helpers/AppError';
import prisma from '../../shared/prisma';
import { toMinutes } from '../Schedule/schedule.utils';

const getMyArchiveSchedulesWithQuery = async (userId: string, query: any) => {
  const { search = '' } = query;

  return await PrismaQueryBuilder({
    model: prisma.archive,
    where: { userId },
    searchFields: ['schedule.title', 'schedule.subject', 'schedule.instructor'],
    search,
    sortField: 'createdAt',
    sortOrder: 'desc',
    include: {
      schedule: true,
    },
  });
};

const deleteArchiveFromDbAndRestoreTheSchedule = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch archive with schedule
    const archive = await tx.archive.findUnique({
      where: { id },
      include: { schedule: true },
    });

    if (!archive || archive.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Archive not found.');
    }

    const schedule = archive.schedule;
    const { day, startTime, endTime, subject, instructor } = schedule;

    // 2. Validate start and end time
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    if (start >= end) {
      throw new AppError(
        status.BAD_REQUEST,
        'End time must be later than start time.',
      );
    }

    // 3. Check for exact duplicate (excluding the archived schedule itself)
    const exactDuplicate = await tx.schedule.findFirst({
      where: {
        id: { not: schedule.id },
        day,
        startTime,
        endTime,
        subject,
        instructor,
        isDeleted: false,
      },
    });

    if (exactDuplicate) {
      throw new AppError(
        status.CONFLICT,
        `A schedule already exists for ${subject} with ${instructor} on ${day} from ${startTime} to ${endTime}.`,
      );
    }

    // 4. Check for overlapping schedules
    const overlappingSchedule = await tx.schedule.findFirst({
      where: {
        id: { not: schedule.id },
        day,
        instructor,
        isDeleted: false,
        OR: [
          {
            // Case A: Existing schedule starts before and ends after the new start
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            // Case B: Existing schedule starts inside the new range
            AND: [
              { startTime: { lt: endTime } },
              { startTime: { gte: startTime } },
            ],
          },
          {
            // Case C: Existing schedule completely inside the new range
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (overlappingSchedule) {
      throw new AppError(
        status.CONFLICT,
        `Time conflict detected! ${instructor} already has a schedule on ${day} from ${overlappingSchedule.startTime} to ${overlappingSchedule.endTime}.`,
      );
    }

    // 5. Restore the schedule (mark as active again)
    await tx.schedule.update({
      where: { id: schedule.id },
      data: {
        isDeleted: false,
      },
    });

    // 6. Delete the archive record
    await tx.archive.delete({
      where: { id },
    });

    return {
      restoredSchedule: schedule,
    };
  });
};

const permanentArchiveDeleteFromDb = async (id: string) => {
  return await prisma.archive.delete({
    where: {
      id,
    },
  });
};

export const ArchiveService = {
  getMyArchiveSchedulesWithQuery,
  deleteArchiveFromDbAndRestoreTheSchedule,
  permanentArchiveDeleteFromDb,
};
