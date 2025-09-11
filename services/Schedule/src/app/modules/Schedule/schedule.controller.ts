import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { ScheduleService } from './schedule.service';
import { tokenDecoder } from '../../helpers/tokenDecoder';

const createSchedule = catchAsync(async (req, res) => {
  const decode = tokenDecoder(req);

  const result = await ScheduleService.createSchedule(req.body, decode.id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Schedule Created Successfully',
    data: result,
  });
});

const updateSchedule = catchAsync(async (req, res) => {
  const decode = tokenDecoder(req);
  const { id } = req.params;

  const result = await ScheduleService.updateSchedule(req.body, id, decode.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedule Updated Successfully',
    data: result,
  });
});

const getMySchedulesWithQuery = catchAsync(async (req, res) => {
  const decode = tokenDecoder(req);
  const schedules = await ScheduleService.getMySchedulesWithQuery(
    decode.id,
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User schedules fetched successfully',
    data: schedules.data,
  });
});

const getMySingleScheduleById = catchAsync(async (req, res) => {
  const userId = tokenDecoder(req).id;
  const { id } = req.params;

  const schedule = await ScheduleService.getMySingleScheduleById(userId, id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedule fetched successfully',
    data: schedule,
  });
});

const archiveSchedules = catchAsync(async (req, res) => {
  const userId = tokenDecoder(req).id;
  const { scheduleIds } = req.body;

  const result = await ScheduleService.archiveSchedules(scheduleIds, userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedules archived successfully',
    data: result,
  });
});

const updatePriority = catchAsync(async (req, res) => {
  const userId = tokenDecoder(req).id;
  const { scheduleId, newPriority } = req.body;

  await ScheduleService.updatePriority({ userId, scheduleId, newPriority });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Priority updated successfully',
    data: null,
  });
});

export const ScheduleController = {
  createSchedule,
  updateSchedule,
  getMySchedulesWithQuery,
  getMySingleScheduleById,
  archiveSchedules,
  updatePriority,
};
