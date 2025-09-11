import { User } from '@prisma/client';
import prisma from '../../shared/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';
import { hashPassword } from '../../helpers/password';
import withoutPassword from './user.utils';

const createUserIntoDb = async (payload: User) => {
  const isExistUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });
  if (isExistUser) {
    throw new AppError(status.CONFLICT, 'User with this email already exists');
  }
  const hashed = await hashPassword(payload.password);

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashed,
    },
  });

  return withoutPassword(result);
};

const updateUserInDb = async (userId: string, payload: Partial<User>) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
  return withoutPassword(updatedUser);
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  } else if (user.isBlocked) {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }
  return withoutPassword(user);
};

export const UserService = {
  createUserIntoDb,
  updateUserInDb,
  getUserById,
};
