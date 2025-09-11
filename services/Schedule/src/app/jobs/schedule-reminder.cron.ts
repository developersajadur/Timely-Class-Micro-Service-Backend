/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { reminderEmailTemplate } from '../../templates/reminderEmailTemplate';
import prisma from '../shared/prisma';
import { sendEmail } from '../utils/email';

export const scheduleReminderJob = async () => {
  const now = new Date();
  const todayStr = now.toDateString();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });

  try {
    // 1. Fetch schedules
    const schedules = await prisma.schedule.findMany({
      where: {
        reminderMinutes: { not: null },
        isDeleted: false,
        OR: [{ date: null, day: weekday }, { date: { not: null } }],
      },
    });

    if (schedules.length === 0) {
      console.log(`[${new Date().toISOString()}] No schedules found.`);
      return;
    }

    // 2. Fetch users from user service
    const userRequests = schedules.map((schedule) =>
      axios
        .get(
          `http://localhost:5001/api/v1/users/get-single-user-without-auth/${schedule.userId}`,
        )
        .then((res) => ({ id: schedule.userId, data: res.data.data as any }))
        .catch((err) => {
          console.error(
            `[${new Date().toISOString()}] Failed to fetch user for scheduleId ${schedule.id}:`,
            err.message,
          );
          return null;
        }),
    );

    const usersArray = await Promise.all(userRequests);

    const usersMap = usersArray.reduce(
      (map, user) => {
        if (user) map[user.id] = user.data;
        return map;
      },
      {} as Record<string, any>,
    );

    // 3. Attach users to schedules safely
    type ScheduleWithUser = (typeof schedules)[number] & { user?: any };
    const schedulesWithUser: ScheduleWithUser[] = schedules.map((s) => ({
      ...s,
      user: usersMap[s.userId],
    }));

    // 4. Process each schedule
    for (const schedule of schedulesWithUser) {
      const user = schedule.user;
      if (!user) continue; // Skip if user not found

      let scheduleDateTime: Date;
      if (schedule.date) {
        scheduleDateTime = new Date(
          `${schedule.date.toDateString()} ${schedule.startTime}`,
        );
      } else {
        scheduleDateTime = new Date(`${todayStr} ${schedule.startTime}`);
      }

      const triggerTime = new Date(
        scheduleDateTime.getTime() - schedule.reminderMinutes! * 60 * 1000,
      );

      // Skip if reminder already sent today for recurring schedule
      if (
        !schedule.date &&
        schedule.lastReminderSent?.toDateString() === todayStr
      )
        continue;

      if (now >= triggerTime && now < scheduleDateTime) {
        const sendForEmail = {
          userName: user.name,
          subject: schedule.subject,
          instructor: schedule.instructor,
          startTime: schedule.startTime,
          day: schedule.day,
        };

        try {
          await sendEmail({
            to: user.email,
            subject: `Reminder For: ${schedule.subject} Class`,
            html: reminderEmailTemplate(sendForEmail),
          });

          await prisma.schedule.update({
            where: { id: schedule.id },
            data: {
              reminderSent: !!schedule.date,
              lastReminderSent: now,
            },
          });

          console.log(
            `[${new Date().toISOString()}] Reminder sent for scheduleId: ${schedule.id}`,
          );
        } catch (error) {
          console.error(
            `[${new Date().toISOString()}] Failed to send email for scheduleId: ${schedule.id}`,
            error,
          );
        }
      }
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] scheduleReminderJob failed:`,
      error,
    );
  }
};
