import status from 'http-status';
import AppError from '../../helpers/AppError';
import prisma from '../../shared/prisma';
import { ILogin } from './auth.interface';
import bcrypt from 'bcrypt';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (data: ILogin) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!userData || userData.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }
  if (userData.isBlocked) {
    throw new AppError(status.NOT_ACCEPTABLE, 'User is blocked!');
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    data.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(
      status.NOT_ACCEPTABLE,
      'You have given a wrong password!',
    );
  }

  // token payload
  const tokenPayload = {
    id: userData.id,
    role: userData.role,
    email: userData.email,
  };

  // access token
  const token = jwtHelpers.createToken(
    tokenPayload,
    config.token_secret as Secret,
    config.token_expires_in as string,
  );

  return {
    token,
  };
};

export const AuthService = {
  loginUser,
};
