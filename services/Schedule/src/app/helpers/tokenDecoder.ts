/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import status from 'http-status';
import config from '../config';
import { jwtHelpers } from './jwtHelpers';
import AppError from './AppError';

export type TJwtPayload = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export const tokenDecoder = (req: Request) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new AppError(status.UNAUTHORIZED, 'You Are Not Authorized');
  }
  const decoded = jwtHelpers.verifyToken(
    token as string,
    config.token_secret as string,
  );
  return decoded;
};
