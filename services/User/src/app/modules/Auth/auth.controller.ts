import status from 'http-status';
import config from '../../config';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { token } = result;

  res.cookie('token', token, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Logged in user successfully',
    data: {
      token: result.token,
    },
  });
});

export const AuthController = {
  loginUser,
};
