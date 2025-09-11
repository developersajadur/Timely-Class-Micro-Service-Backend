import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { ReminderService } from './reminder.service';
import { tokenDecoder } from '../../helpers/tokenDecoder';

const addOrUpdateReminder = catchAsync(async (req, res) => {
  const { scheduleId, reminderMinutes } = req.body;
  const decoded = tokenDecoder(req);

  if (!scheduleId || !reminderMinutes) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const schedule = await ReminderService.addOrUpdateReminder(
    scheduleId,
    decoded.id,
    reminderMinutes,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reminder set successfully',
    data: schedule,
  });
});

export const ReminderController = {
  addOrUpdateReminder,
};
