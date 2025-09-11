import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { tokenDecoder } from '../../helpers/tokenDecoder';
import { ArchiveService } from './archive.service';

const getMyArchiveSchedulesWithQuery = catchAsync(async (req, res) => {
  const decode = tokenDecoder(req);
  const archives = await ArchiveService.getMyArchiveSchedulesWithQuery(
    decode.id,
    req.query,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User archive fetched successfully',
    data: archives.data,
  });
});

const deleteArchiveFromDbAndRestoreTheSchedule = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await ArchiveService.deleteArchiveFromDbAndRestoreTheSchedule(id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Archive deleted and schedule restored successfully',
      data: result.restoredSchedule,
    });
  },
);

const permanentArchiveDeleteFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  await ArchiveService.permanentArchiveDeleteFromDb(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Archive deleted and schedule restored successfully',
    data: null,
  });
});

export const ArchiveController = {
  getMyArchiveSchedulesWithQuery,
  deleteArchiveFromDbAndRestoreTheSchedule,
  permanentArchiveDeleteFromDb,
};
