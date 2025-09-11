/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../helpers/AppError';
import { Schedule } from '@prisma/client';
import prisma from '../../shared/prisma';
import { PrismaQueryBuilder } from '../../builders/PrismaQueryBuilder';
import { IUpdatePriorityInput } from './schedule.interface';
import { toMinutes } from './schedule.utils';

const createSchedule = async (payload: Schedule, userId: string) => {
  const { day, startTime, endTime, subject, instructor } = payload;

  // 1. Validate start and end time
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (start >= end) {
    throw new AppError(
      status.BAD_REQUEST,
      'End time must be later than start time.',
    );
  }

  // 2. Check for exact duplicate
  const exactDuplicate = await prisma.schedule.findFirst({
    where: {
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

  // 3. Check for overlapping time ranges
  const overlappingSchedule = await prisma.schedule.findFirst({
    where: {
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
  const lastSchedule = await prisma.schedule.findFirst({
    where: { userId },
    orderBy: { priority: 'desc' },
  });

  const newPriority = lastSchedule ? lastSchedule.priority + 1 : 1;
  const result = await prisma.schedule.create({
    data: {
      ...payload,
      priority: newPriority,
      userId: userId,
    },
  });

  return result;
};

const updateSchedule = async (
  payload: Partial<Schedule>,
  scheduleId: string,
  userId: string,
) => {
  const schedule = await prisma.schedule.findFirst({
    where: { id: scheduleId, userId, isDeleted: false },
  });

  if (!schedule) {
    throw new AppError(status.NOT_FOUND, 'Schedule not found');
  }

  // If updating time, validate conflicts
  if (payload.startTime || payload.endTime) {
    const start = payload.startTime
      ? toMinutes(payload.startTime)
      : toMinutes(schedule.startTime);
    const end = payload.endTime
      ? toMinutes(payload.endTime)
      : toMinutes(schedule.endTime);

    if (start >= end) {
      throw new AppError(
        status.BAD_REQUEST,
        'End time must be later than start time.',
      );
    }

    const overlappingSchedule = await prisma.schedule.findFirst({
      where: {
        id: { not: scheduleId },
        day: payload.day || schedule.day,
        instructor: payload.instructor || schedule.instructor,
        isDeleted: false,
        OR: [
          {
            AND: [
              { startTime: { lte: payload.startTime || schedule.startTime } },
              { endTime: { gt: payload.startTime || schedule.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: payload.endTime || schedule.endTime } },
              { startTime: { gte: payload.startTime || schedule.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: payload.startTime || schedule.startTime } },
              { endTime: { lte: payload.endTime || schedule.endTime } },
            ],
          },
        ],
      },
    });

    if (overlappingSchedule) {
      throw new AppError(
        status.CONFLICT,
        `Time conflict detected! ${overlappingSchedule.instructor} already has a schedule on ${
          overlappingSchedule.day
        } from ${overlappingSchedule.startTime} to ${overlappingSchedule.endTime}.`,
      );
    }
  }

  // Update schedule
  const updatedSchedule = await prisma.schedule.update({
    where: { id: scheduleId },
    data: payload,
  });

  return updatedSchedule;
};

const getMySchedulesWithQuery = async (userId: string, query: any) => {
  const { search = '' } = query;

  return await PrismaQueryBuilder({
    model: prisma.schedule,
    where: { userId, isDeleted: false },
    searchFields: ['subject', 'title', 'instructor'],
    search,
    sortField: 'priority',
    sortOrder: 'asc',
  });
};

const getMySingleScheduleById = async (userId: string, scheduleId: string) => {
  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      userId,
      isDeleted: false,
    },
  });

  if (!schedule) {
    throw new AppError(status.NOT_FOUND, 'Schedule not found');
  }

  return schedule;
};

const archiveSchedules = async (scheduleIds: string[], userId: string) => {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Validate schedules
    const schedules = await tx.schedule.findMany({
      where: {
        id: { in: scheduleIds },
        userId,
        isDeleted: false,
      },
    });

    // Find which scheduleIds are missing
    const foundIds = schedules.map((s) => s.id);
    const missingIds = scheduleIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new AppError(
        status.BAD_REQUEST,
        `The following schedules are invalid: ${missingIds.join(', ')}`,
      );
    }

    // Step 2: Mark schedules as deleted
    await tx.schedule.updateMany({
      where: {
        id: { in: scheduleIds },
        userId,
      },
      data: {
        isDeleted: true,
      },
    });

    // Step 3: Create archive records
    const archiveData = schedules.map((schedule) => ({
      scheduleId: schedule.id,
      userId: userId,
    }));

    await tx.archive.createMany({
      data: archiveData,
    });
    const archivedCount = archiveData.length;
    return archivedCount;
  });
};

const updatePriority = async ({
  userId,
  scheduleId,
  newPriority,
}: IUpdatePriorityInput) => {
  return await prisma.$transaction(async (tx) => {
    const schedule = await tx.schedule.findFirst({
      where: { id: scheduleId, userId, isDeleted: false },
    });

    if (!schedule) {
      throw new AppError(status.NOT_FOUND, 'Schedule not found.');
    }

    const oldPriority = schedule.priority;

    if (oldPriority === newPriority) {
      return { message: 'Priority is already correct. No changes made.' };
    }

    // Step 0: Temporarily set the moving schedule to a negative priority
    await tx.schedule.update({
      where: { id: scheduleId },
      data: { priority: -1 },
    });

    // Step 1: Shift other schedules
    if (newPriority < oldPriority) {
      // Moving UP → increment priorities between newPriority and oldPriority - 1
      await tx.schedule.updateMany({
        where: {
          userId,
          isDeleted: false,
          priority: { gte: newPriority, lt: oldPriority },
        },
        data: { priority: { increment: 1 } },
      });
    } else {
      // Moving DOWN → decrement priorities between oldPriority + 1 and newPriority
      await tx.schedule.updateMany({
        where: {
          userId,
          isDeleted: false,
          priority: { gt: oldPriority, lte: newPriority },
        },
        data: { priority: { decrement: 1 } },
      });
    }

    // Step 2: Assign final priority to the moving schedule
    await tx.schedule.update({
      where: { id: scheduleId },
      data: { priority: newPriority },
    });

    return { message: 'Priority updated successfully.' };
  });
};

export const ScheduleService = {
  createSchedule,
  updateSchedule,
  getMySchedulesWithQuery,
  getMySingleScheduleById,
  archiveSchedules,
  updatePriority,
};
