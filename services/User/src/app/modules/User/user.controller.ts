import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { UserService } from './user.service';
import { tokenDecoder } from '../../helpers/tokenDecoder';

const createUserIntoDb = catchAsync(async (req, res) => {
  const result = await UserService.createUserIntoDb(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User Created Successfully',
    data: result,
  });
});

const updateUserInDb = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const payload = req.body;

  const result = await UserService.updateUserInDb(decoded.id, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.getUserById(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});
const getUserByIdWithoutAuth = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.getUserById(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

export const UserController = {
  createUserIntoDb,
  updateUserInDb,
  getUserById,
  getUserByIdWithoutAuth,
};
