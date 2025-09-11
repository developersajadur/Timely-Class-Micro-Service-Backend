import cron from 'node-cron';
import { scheduleReminderJob } from './schedule-reminder.cron';

export const initializeJobs = () => {
  try {
    cron.schedule('* * * * *', scheduleReminderJob);
    console.log(' All cron jobs are running');
  } catch (error) {
    console.error('Failed to initialize cron jobs:', error);
  }
};
